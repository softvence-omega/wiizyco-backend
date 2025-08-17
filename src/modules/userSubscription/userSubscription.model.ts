import mongoose, { Schema } from "mongoose";
import { TUserSubscription } from "./userSubscription.interface";

const userSubscriptionSchema = new Schema<TUserSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  // Stripe info
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  stripePaymentIntentId: { type: String }, // for one-time payments
  type: { type: String, enum: ["subscription", "one_time"], required: true },
  // For subscriptions
  billingInterval: { type: String, enum: ["day", "week", "month", "year", null], default: null },
  price: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ["active", "canceled", "pending", "completed", "inactive"],
    default: "inactive"
  },
  promoCodeId: { type: Schema.Types.ObjectId, ref: "PromoCode", default: null },

}, { timestamps: true });

export const UserSubscriptionModel = mongoose.model<TUserSubscription>(
  "UserSubscription",
  userSubscriptionSchema
);
