// src/modules/messages/messages.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../util/catchAsync';
import messagesService from './messages.service';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import { Types } from 'mongoose';

// ... existing sendMessage & getConversation ...

export const getUnreadCounts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const withUserId = (req.query.with as string) || undefined;
    const result = await messagesService.getUnreadCount(userId, withUserId);
    res.status(200).json({ success: true, data: result });
  },
);

export const markConversationRead = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const { otherUserId } = req.params;
    await messagesService.markAsReadUpTo(userId, otherUserId);

    // realtime: notify the other user that their sent messages were read
    const io = req.app.get('io');
    io.to(`user:${otherUserId}`).emit('message:read', { by: userId });

    res.status(200).json({ success: true, message: 'Marked as read' });
  },
);

export const deleteForMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id as string;
  const { id } = req.params;
  const msg = await messagesService.softDeleteForUser(id, userId);
  res
    .status(200)
    .json({ success: true, message: 'Deleted for me', data: msg._id });
});

export const retractForEveryone = catchAsync(
  async (req: Request, res: Response) => {
    const senderId = req.user.id as string;
    const { id } = req.params;
    const msg = await messagesService.retractMessage(id, senderId);

    const io = req.app.get('io');
    io.to(`user:${msg.receiver}`).emit('message:retracted', { id: msg._id });
    io.to(`user:${msg.sender}`).emit('message:retracted', { id: msg._id });

    res
      .status(200)
      .json({ success: true, message: 'Message retracted', data: msg._id });
  },
);

// sending stays same but ensure encryption + file handled
export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { receiver, type, text, fileName } = req.body as {
    receiver: string;
    type: 'text' | 'emoji' | 'file';
    text?: string;
    fileName?: string;
  };

  const sender = req.user.id as string;
  if (!receiver) throw new Error('receiver is required');
  if (!type) throw new Error('type is required');

  let fileUrl: string | undefined;
  let fileType: string | undefined;

  if (type === 'file') {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) throw new Error('file is required for type=file');
    fileUrl = await uploadToCloudinary(file.path, 'chat/files'); // resource_type:auto
    fileType = file.mimetype;
  }

  const message = await messagesService.createMessage({
    sender: new Types.ObjectId(sender),
    receiver: new Types.ObjectId(receiver),
    type,
    text,
    fileUrl,
    fileType,
    fileName,
  });

  const io = req.app.get('io');
  io.to(`user:${receiver}`).emit('message:new', message);
  io.to(`user:${sender}`).emit('message:sent', message);

  res
    .status(201)
    .json({ success: true, message: 'Message sent', data: message });
});

export const getConversation = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const { otherUserId } = req.params;
    const { limit, before } = req.query as { limit?: string; before?: string };

    const messages = await messagesService.getMessagesBetween(
      userId,
      otherUserId,
      limit ? parseInt(limit, 10) : 50,
      before,
    );

    await messagesService.markAsReadUpTo(userId, otherUserId);

    res
      .status(200)
      .json({ success: true, message: 'Conversation fetched', data: messages });
  },
);

export default {
  sendMessage,
  getConversation,
  getUnreadCounts,
  markConversationRead,
  deleteForMe,
  retractForEveryone,
};
