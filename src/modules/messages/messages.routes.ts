// src/modules/messages/messages.routes.ts
import express from 'express';
import auth from '../../middleware/auth';
import { upload } from '../../util/upload';
import messagesController from './messages.controller';
import { userRole } from '../../constants';

const router = express.Router();

router.post(
  '/send',
  auth(userRole.user, userRole.admin),
  upload.single('file'),
  messagesController.sendMessage,
);

router.get(
  '/:otherUserId',
  auth(userRole.user, userRole.admin),
  messagesController.getConversation,
);

// NEW
router.get(
  '/unread/count',
  auth(userRole.user, userRole.admin),
  messagesController.getUnreadCounts,
);

router.post(
  '/read/:otherUserId',
  auth(userRole.user, userRole.admin),
  messagesController.markConversationRead,
);

router.post(
  '/:id/delete',
  auth(userRole.user, userRole.admin),
  messagesController.deleteForMe,
);

router.post(
  '/:id/retract',
  auth(userRole.user, userRole.admin),
  messagesController.retractForEveryone,
);

export default router;
