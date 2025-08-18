import { stripe } from '../../config';
import { PlanModel } from '../plan/plan.model';
import { UserSubscriptionModel } from '../userSubscription/userSubscription.model';

/**
 * Get or create a Stripe customer
 */
export async function getOrCreateStripeCustomer(user: any) {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
  });
  return customer.id;
}

/**
 * Create a Checkout Session for a plan (subscription or one-time).
 * Checks slots if available.
 */
export async function createCheckoutSession(params: {
  user: any;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const { user, planId, successUrl, cancelUrl } = params;

  const plan = await PlanModel.findById(planId);
  if (!plan) throw new Error('Plan not found');

  // ✅ Only check slots if plan has slots
  if (
    plan.availableSlots !== undefined &&
    plan.availableSlots !== null &&
    plan.availableSlots <= 0
  ) {
    throw new Error('No slots available for this plan');
  }

  const stripeCustomerId = await getOrCreateStripeCustomer(user);

  const sessionParams: any = {
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: plan.price * 100,
          product_data: { name: plan.name },
          recurring: plan.subscription
            ? { interval: plan.billingInterval }
            : undefined,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ['card'],
    mode: plan.subscription ? 'subscription' : 'payment',
    metadata: {
      userId: user.id,
      planId: plan._id.toString(),
    },
  };

  if (plan.subscription && plan.freeTrialDays) {
    sessionParams.subscription_data = { trial_period_days: plan.freeTrialDays };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  // Save a pending subscription record
  const userSubscription = new UserSubscriptionModel({
    userId: user.id,
    planId: plan._id,
    stripeCustomerId,
    price: plan.price,
    type: plan.subscription ? 'subscription' : 'one_time',
    status: 'pending',
    transactionId: session.id,
    startDate: plan.subscription ? new Date() : null,
    endDate: plan.subscription ? null : new Date(),
  });

  await userSubscription.save();

  return session;
}

/**
 * Called after Stripe payment success (webhook or verify).
 * Decreases slots if plan has them.
 */
export async function handlePaymentSuccess(
  userId: string,
  planId: string,
  transactionId: string,
) {
  const subscription = await UserSubscriptionModel.findOne({
    userId,
    planId,
    transactionId,
    status: 'pending',
  });

  if (!subscription) return;

  subscription.status = 'active';
  subscription.startDate = new Date();
  await subscription.save();

  // ✅ Decrement slot only if plan has slots
  const updatedPlan = await PlanModel.findOneAndUpdate(
    { _id: planId, availableSlots: { $gt: 0 } },
    { $inc: { availableSlots: -1 } },
    { new: true },
  );

  if (!updatedPlan && subscription) {
    // If no slots left, cancel subscription
    subscription.status = 'canceled';
    await subscription.save();
    throw new Error('Plan sold out');
  }

  return subscription;
}

const paymentService = { createCheckoutSession, handlePaymentSuccess };
export default paymentService;
