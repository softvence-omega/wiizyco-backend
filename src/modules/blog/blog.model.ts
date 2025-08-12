import { Schema, model } from 'mongoose';
import { TBlog } from './blog.interface';

const BlogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    imageTitle: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true, // will handle createdAt and updatedAt automatically
  },
);

export const BlogModel = model<TBlog>('Blog', BlogSchema);
