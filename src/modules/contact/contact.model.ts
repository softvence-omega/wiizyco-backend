import { Schema, model } from "mongoose";
import { TContact } from "./contact.interface"; // your interface file

const ContactSchema = new Schema<TContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Bug", "General", "Media", "Partnership"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const ContactModel = model<TContact>("Contact", ContactSchema);
