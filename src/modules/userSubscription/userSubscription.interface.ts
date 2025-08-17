import mongoose from "mongoose";

export type TUserSubscription = {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  // Stripe details
  stripeCustomerId?: string;
  stripeSubscriptionId?: string; // for recurring subscriptions
  stripePaymentIntentId?: string; // for one-time payments
  type: "subscription" | "one_time";
  billingInterval?: "day" | "week" | "month" | "year" | null;
  price: number;
  currency: string;
  startDate?: Date;
  endDate?: Date | null;
  status: "active" | "canceled" | "pending" | "completed" | "inactive" | "past_due";
  promoCodeId?: mongoose.Types.ObjectId | null;
};
