// src/modules/project/project.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { TProject } from './marketplace.interface';

const ProjectSchema = new Schema<TProject & Document>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'UserCollection', required: true },
    title: { type: String, required: false },
    category: { type: String, required: false },
    description: { type: String, required: false },
    completion: { type: Number, required: false, min: 0, max: 100 },
    investmentAmount: { type: Number, required: false },
    dealType: { type: String, enum: ['sale', 'equity', 'partnership'], required: false },
    ndaRequired: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    documents: {
      images: { type: [String], default: [], required: true },
      docs: { type: [String], default: [] },
    },
    contactEmail: { type: String, required: false },
    status: {
      type: String,
      enum: ['In negotiation', 'Accepted', 'Rejected'],
      default: 'In negotiation',
    },
    // offers: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true } // automatically creates createdAt & updatedAt
);

export const ProjectModel = mongoose.model<TProject & Document>('Project', ProjectSchema);
