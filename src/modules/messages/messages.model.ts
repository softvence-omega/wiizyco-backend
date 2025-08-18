// src/modules/messages/messages.model.ts
import mongoose, { Schema } from 'mongoose';
import { IMessage } from './messages.interface';

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: { type: String, enum: ['text', 'emoji', 'file'], required: true },

    enc: {
      ciphertext: String,
      iv: String,
      tag: String,
      meta: {
        fileType: String,
        fileName: String,
      },
    },

    text: String, // optional: only when returning decrypted value inline
    fileUrl: String, // optional: only when returning decrypted value inline
    fileType: String, // back-compat / quick access

    readAt: { type: Date, default: null },
    deletedFor: { type: [Schema.Types.ObjectId], default: [], index: true },
    retractedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Helpful compound index for conversations & pagination
MessageSchema.index({ sender: 1, receiver: 1, _id: -1 });
MessageSchema.index({ receiver: 1, readAt: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
