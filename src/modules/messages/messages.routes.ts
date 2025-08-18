// src/modules/messages/messages.routes.ts
import express from 'express';
import auth from '../../middleware/auth';
import { upload } from '../../util/upload';
import messagesController from './messages.controller';
import { userRole } from '../../constants';

const router = express.Router();

router.post(
  '/send',
  auth(userRole.user, userRole.admin, userRole.reviver, userRole.founder),
  upload.single('file'),
  messagesController.sendMessage,
);

router.get(
  '/:otherUserId',
  auth(userRole.user, userRole.admin, userRole.reviver, userRole.founder),
  messagesController.getConversation,
);

// NEW
router.get(
  '/unread/count',
  auth(userRole.user, userRole.admin, userRole.reviver, userRole.founder),
  messagesController.getUnreadCounts,
);

router.post(
  '/read/:otherUserId',
  auth(userRole.user, userRole.admin, userRole.reviver, userRole.founder),
  messagesController.markConversationRead,
);

router.post(
  '/:id/delete',
  auth(userRole.user, userRole.admin, userRole.reviver, userRole.founder),
  messagesController.deleteForMe,
);

router.post(
  '/:id/retract',
  auth(userRole.user, userRole.admin, userRole.reviver, userRole.founder),
  messagesController.retractForEveryone,
);

export default router;
