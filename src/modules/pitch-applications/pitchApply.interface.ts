import { Types } from 'mongoose';

export type TPitchApplicationProjectStatus = 'idea' | 'prototype' | 'live';

export type TPitchApplicationOfferType = 'equity' | 'revenue_share' | 'other';

export type TPitchApplicationStatus = 'submitted' | 'accepted' | 'rejected';

export type TPitchApplicationGoal =
  | 'pre-seed'
  | 'seed'
  | 'marketing'
  | 'technical'
  | 'other';

export type TPitchApplication = {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  projectTitle: string;
  projectDescription: string;
  goal: TPitchApplicationGoal[];
  offerType: TPitchApplicationOfferType;
  supportingMaterials: {
    video: string;
    docs: string[];
  };
  projectStatus: TPitchApplicationProjectStatus;
  age?: number;
  applicationStatus: TPitchApplicationStatus;
  socialLinks: { website: string; linkedin: string; twitter: string };
  publicConsent: boolean;
};
