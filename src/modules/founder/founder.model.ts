import { Schema, model } from 'mongoose';
import { TFounder } from './founder.interface';

const founderSchema = new Schema<TFounder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    linkedInLink: {
      type: String,
      trim: true,
      required: false,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: [String],
      enum: ['mentorship', 'partnership', 'investment', 'selling'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'banned'],
      default: 'pending',
      required: true,
    },
    aboutReviveHub: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const FounderModel = model<TFounder>('Founder', founderSchema);
