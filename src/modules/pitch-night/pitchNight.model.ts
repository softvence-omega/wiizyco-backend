import mongoose, { Schema } from 'mongoose';
import { TPitchNightEvent } from './pitchNight.interface';

const pitchNightSchema = new Schema<TPitchNightEvent>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'past'],
      required: true,
    },
    eventDate: { type: Date, required: true },
    applicationDeadline: { type: Date, required: true },
    eventDescription: { type: String, required: true },
    eventBanner: { type: String, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Virtual populate guests
pitchNightSchema.virtual('guests', {
  ref: 'PitchGuest',
  localField: '_id',
  foreignField: 'eventId',
});

// Virtual populate applications
pitchNightSchema.virtual('applications', {
  ref: 'PitchApplication',
  localField: '_id',
  foreignField: 'eventId',
});

export const PitchNight = mongoose.model<TPitchNightEvent>(
  'PitchNight',
  pitchNightSchema,
);
