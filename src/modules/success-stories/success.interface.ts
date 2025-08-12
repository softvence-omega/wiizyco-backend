import { Types } from 'mongoose';

export type TSuccessStory ={
  name:string;
  email:string;
  projectTitle:string;
  role:string;
  projectSummary:string;
  projectStory:string;
  documents: {
    images: string[]; // URLs or paths
    docs: string[];   // URLs or paths
  };
  author:Types.ObjectId;
  createdAt:Date;
  updatedAt:Date;
}
