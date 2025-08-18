import mongoose, { Schema } from 'mongoose';
import { TPlan } from './plan.interface';

const planSchema = new Schema<TPlan>({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stripePriceId: { type: String, unique: true, required: true },
  heading: { type: String },
  services: { type: [String], required: true },
  freeTrialDays: { type: Number, default: 0 },
  bestValue: { type: Boolean, default: false },
  subscription: { type: Boolean, default: false },
  oneTimePayment: { type: Boolean, default: false },
  billingInterval: {
    type: String,
    enum: ['week', 'month', 'year'],
    default: 'month',
  },
  description: { type: String, default: '' },

  // ✅ Optional slot system
  availableSlots: { type: Number, default: null },
});

export const PlanModel = mongoose.model<TPlan>('PlanCollection', planSchema);
