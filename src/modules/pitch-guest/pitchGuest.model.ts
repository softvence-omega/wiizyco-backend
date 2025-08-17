import mongoose, { Schema } from 'mongoose';
import { TPitchGuest } from './pitchGuest.interface';

const pitchGuestSchema = new Schema<TPitchGuest>({
  eventId: { type: Schema.Types.ObjectId, ref: "PitchNight", required: true },
  guestName: { type: String, required: true },
  designation: { type: String, required: true },
  shortDescription: { type: String, required: true },
  guestImage: { type: String, required: true },
  guestRole: { type: String, required: true },
});

const PitchGuest = mongoose.model<TPitchGuest>('PitchGuest', pitchGuestSchema);
export default PitchGuest;
