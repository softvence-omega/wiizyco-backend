import mongoose, { Schema } from 'mongoose';
import { TPitchApplication } from './pitchApply.interface';

const pitchApplicationSchema = new Schema<TPitchApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'UserCollection', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'PitchNight', required: true },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
  goal: [
    {
      type: String,
      enum: [
        'pre-seed',
        'seed',
        'technical',
        'marketing',
        'mentorship',
        'testers',
      ],
    },
  ],
  offerType: {
    type: String,
    enum: ['equity', 'revenue share'],
    required: true,
  },
  supportingMaterials: {
    video: { type: String, default: '', required: true },
    docs: { type: [String], default: [], required: true },
  },
  projectStatus: {
    type: String,
    enum: ['idea', 'prototype', 'live'],
    required: true,
  },
  age: { type: Number },
  socialLinks: {
    website: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  publicConsent: { type: Boolean, default: false },
  applicationStatus: {
    type: String,
    enum: ['submitted', 'accepted', 'rejected'],
    required: true,
    default: 'submitted',
  },
});

export const PitchApplication = mongoose.model<TPitchApplication>(
  'PitchApplication',
  pitchApplicationSchema,
);
