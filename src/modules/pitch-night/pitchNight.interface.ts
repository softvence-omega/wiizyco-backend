import { Types } from 'mongoose';

export type TPitchNightEventStatus = 'upcoming' | 'live' | 'past';

export type TPitchNightEvent = {
  user_id: Types.ObjectId;
  eventName: string;
  status: TPitchNightEventStatus;
  eventDate: Date;
  applicationDeadline: Date;
  eventDescription: string;
  eventBanner: string;
  guestDetails: Types.ObjectId[];
  applicants: Types.ObjectId[];
};
