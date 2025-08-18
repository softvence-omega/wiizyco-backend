// src/modules/messages/messages.service.ts
import { Types } from 'mongoose';
import { Message } from './messages.model';
import { IMessage, MessageType } from './messages.interface';
import { encryptJSON, decryptJSON } from '../../util/crypto';

type CreateMessageInput = {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: MessageType;
  text?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
};

const hydrateDecrypted = (doc: IMessage, returnDecrypted = true) => {
  const json = doc.toObject();
  if (returnDecrypted && json.enc) {
    try {
      const data = decryptJSON(json.enc);
      if (json.type === 'file') {
        json.fileUrl = data.fileUrl;
        json.fileType = data.fileType;
      } else {
        json.text = data.text;
      }
    } catch {
      // ignore decryption errors in responses
    }
  }
  return json;
};

const createMessage = async (payload: CreateMessageInput) => {
  // Encrypt content
  let enc;
  if (payload.type === 'file') {
    enc = encryptJSON({
      fileUrl: payload.fileUrl,
      fileType: payload.fileType,
      fileName: payload.fileName,
    });
  } else {
    enc = encryptJSON({ text: payload.text || '' });
  }

  const msg = await Message.create({
    sender: payload.sender,
    receiver: payload.receiver,
    type: payload.type,
    enc,
    // keep quick-access fields if you want (optional)
    fileType: payload.fileType,
  });

  return hydrateDecrypted(
    await msg.populate([{ path: 'sender' }, { path: 'receiver' }]),
  );
};

const getMessagesBetween = async (
  requesterId: string,
  otherUserId: string,
  limit = 50,
  before?: string,
) => {
  const $or = [
    { sender: requesterId, receiver: otherUserId },
    { sender: otherUserId, receiver: requesterId },
  ];

  const query: any = {
    $or,
    deletedFor: { $ne: new Types.ObjectId(requesterId) },
  };
  if (before) query._id = { $lt: new Types.ObjectId(before) };

  const docs = await Message.find(query).sort({ _id: -1 }).limit(limit);
  return docs.reverse().map((d) => hydrateDecrypted(d));
};

const markAsReadUpTo = async (userId: string, otherUserId: string) => {
  await Message.updateMany(
    { sender: otherUserId, receiver: userId, readAt: null },
    { $set: { readAt: new Date() } },
  );
};

const getUnreadCount = async (userId: string, withUserId?: string) => {
  const match: any = { receiver: new Types.ObjectId(userId), readAt: null };
  if (withUserId) match.sender = new Types.ObjectId(withUserId);

  const pipeline = [
    { $match: match },
    { $group: { _id: '$sender', count: { $sum: 1 } } },
  ];

  const agg = await Message.aggregate(pipeline);
  // if withUserId specified, return single number
  if (withUserId) return agg[0]?.count || 0;

  // otherwise, keyed list { [senderId]: count }
  const map: Record<string, number> = {};
  agg.forEach((row) => (map[String(row._id)] = row.count));
  return map;
};

// Soft delete for current user only
const softDeleteForUser = async (messageId: string, userId: string) => {
  const msg = await Message.findByIdAndUpdate(
    messageId,
    { $addToSet: { deletedFor: new Types.ObjectId(userId) } },
    { new: true },
  );
  if (!msg) throw new Error('Message not found');
  return msg;
};

// Retract (sender only) – hides content for everyone
const retractMessage = async (messageId: string, senderId: string) => {
  const msg = await Message.findById(messageId);
  if (!msg) throw new Error('Message not found');
  if (String(msg.sender) !== String(senderId)) {
    throw new Error('Only the sender can retract this message');
  }
  if (msg.retractedAt) return msg; // already retracted

  msg.retractedAt = new Date();
  // wipe public fields; keep enc but you can also replace with empty
  msg.enc = encryptJSON({ text: '' });
  msg.text = '⟲ Message retracted'; // optional UI hint
  msg.fileUrl = undefined;
  await msg.save();
  return msg;
};

export default {
  createMessage,
  getMessagesBetween,
  markAsReadUpTo,
  getUnreadCount,
  softDeleteForUser,
  retractMessage,
};
