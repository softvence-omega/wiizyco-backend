// src/modules/messages/messages.interface.ts
import { Document, Types } from "mongoose";

export type MessageType = "text" | "emoji" | "file";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: MessageType;

  // encrypted fields (see encryption util below)
  enc?: {
    ciphertext: string;
    iv: string;
    tag: string;
    // optional: store original MIME & name for files
    meta?: { fileType?: string; fileName?: string };
  };

  // kept for back-compat if you want to return decrypted values
  text?: string;
  fileUrl?: string;
  fileType?: string;

  readAt?: Date | null;

  // soft delete / retract
  deletedFor?: Types.ObjectId[]; // users who soft-deleted this message
  retractedAt?: Date | null;     // when sender retracted
  createdAt: Date;
  updatedAt: Date;
}
