import { Types } from "mongoose";

export type TPitchGuest = {
  eventId: Types.ObjectId;
  guestName: string;
  designation: string;
  shortDescription: string;
  guestImage: string;
  guestRole: string;
};
