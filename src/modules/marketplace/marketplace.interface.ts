import { Types } from "mongoose";

export type TDealType = 'sale' | 'equity' | 'partnership';
export type TStatus = 'In negotiation' | 'Accepted' | 'Rejected';

export type TProject = {
  title: string;
  category: string;
  description: string;
  completion: number; // 0–100
  investmentAmount: number;
  dealType: TDealType;
  ndaRequired: boolean;
  verified: boolean;
  documents: {
    images: string[]; // URLs or paths
    docs: string[];   // URLs or paths
  };
  contactEmail: string;
  status: TStatus;
  // offers: any[]; // You can replace any with a detailed Offer type
  createdAt?: Date;
  updatedAt?: Date;
user_id: Types.ObjectId;
}

