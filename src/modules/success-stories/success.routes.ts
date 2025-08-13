import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import { upload } from '../../util/uploadImgToCloudinary';
import successStoryController from './success.controller';

const successRoutes = express.Router();

successRoutes.post(
  '/create',
  auth(userRole.user, userRole.admin),
  upload.fields([
    { name: 'images', maxCount: 3 },
    { name: 'docs', maxCount: 3 },
  ]),
  successStoryController.createSuccessStory,
);
successRoutes.get('/all', successStoryController.getAllSuccessStories);

successRoutes.get(
  '/singleSuccessStory/:id',
  auth(userRole.user, userRole.admin),
  successStoryController.getSuccessStoryById,
);

successRoutes.get('/mySuccessStories', auth(userRole.user, userRole.admin), successStoryController.getMySuccessStories);

successRoutes.patch(
  '/update/:id',
  auth(userRole.user, userRole.admin),
  upload.fields([
    { name: 'images', maxCount: 3 },
  ]),
  successStoryController.updateSuccessStory,
);
successRoutes.delete(
  '/delete/:id',
  auth(userRole.user, userRole.admin),
  successStoryController.deleteSuccessStory,
);

export default successRoutes;
