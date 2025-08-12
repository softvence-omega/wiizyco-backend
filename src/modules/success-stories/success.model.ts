import { Schema, model } from 'mongoose';
import { TSuccessStory } from './success.interface';

const SuccessStorySchema = new Schema<TSuccessStory>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    projectTitle: { type: String, required: true },
    role: { type: String, required: true },
    projectSummary: { type: String, required: true },
    projectStory: { type: String, required: true },
    documents: {
      images: { type: [String], default: [] },
      docs: { type: [String], default: [] },
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export const SuccessStoryModel = model<TSuccessStory>(
  'SuccessStory',
  SuccessStorySchema,
);
