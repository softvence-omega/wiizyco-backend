import { Document } from "mongoose";

export type ContactCategory = 'Bug' | 'General' | 'Media' | 'Partnership';

export interface TContact extends Document {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
}
