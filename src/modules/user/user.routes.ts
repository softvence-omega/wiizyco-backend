import express from 'express';
import userController from './user.controller';
import { userRole } from '../../constants';
import auth from '../../middleware/auth';
import { upload } from '../../util/uploadImgToCloudinary';

const userRoutes = express.Router();

// users routes
userRoutes.post('/createUser', userController.createUser);

userRoutes.patch(
  '/updateProfileData',
  auth(userRole.admin, userRole.user),
  userController.updateProfileData,
);
userRoutes.delete(
  '/selfDestruct',
  auth(userRole.user),
  userController.selfDestruct,
);
userRoutes.post(
  '/uploadOrChangeImg',
  auth(userRole.admin, userRole.user),
  upload.single('files'),
  userController.uploadOrChangeImg,
);

userRoutes.get(
  '/getProfile',
  auth(userRole.admin, userRole.user),
  userController.getProfile,
);

// admin routes
userRoutes.get(
  '/getAlluser',
  auth(userRole.admin, userRole.user),
  userController.getAllUsers,
);
userRoutes.delete(
  '/deleteSingleUser',
  auth(userRole.admin),
  userController.deleteSingleUser,
);

export default userRoutes;
