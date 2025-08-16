import mongoose, { Schema } from 'mongoose';
import { TPitchNightEvent } from './pitchNight.interface';

const pitchNightSchema = new Schema<TPitchNightEvent>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'live', 'past'], required: true },
  eventDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  eventDescription: { type: String, required: true },
  eventBanner: { type: String, required: true },
  guestDetails: [{ type: Schema.Types.ObjectId, ref: 'PitchGuest' }],
  applicants: [{ type: Schema.Types.ObjectId, ref: 'PitchApplication' }],
});

export const PitchNight = mongoose.model<TPitchNightEvent>(
  'PitchNight',
  pitchNightSchema,
);
