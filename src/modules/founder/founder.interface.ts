import { Document, Types } from 'mongoose';

export type FounderCategory =
  | 'mentorship'
  | 'partnership'
  | 'investment'
  | 'selling';

export type FounderStatus = 'pending' | 'approved' | 'rejected' | 'banned';

export interface TFounder extends Document {
  user_id: Types.ObjectId;
  name: string;
  email: string;
  linkedInLink?: string; // optional
  about: string;
  category: FounderCategory[]; // array of categories
  status: FounderStatus;
  aboutReviveHub: string;
}
