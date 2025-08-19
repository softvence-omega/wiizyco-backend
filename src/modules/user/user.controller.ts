import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import idConverter from '../../util/idConverter';
import userServices from './user.service';

const createUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await userServices.createUser(user);
  res.status(200).json({
    message: result.message || 'user created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users',
    data: result,
  });
});

const updateProfileData = catchAsync(async (req, res) => {
  const user_id =
    typeof req.user.id === 'string' ? idConverter(req.user.id) : req.user.id;
  const payload = req.body;
  const result = await userServices.updateProfileData(user_id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'profile updated',
    data: result,
  });
});

const deleteSingleUser = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error('user id conversion failed');
  }
  const result = await userServices.deleteSingleUser(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'user deleted',
    data: result,
  });
});

const selfDestruct = catchAsync(async (req, res) => {
  const user_id = req.user.id;
  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error('user id conversion failed');
  }
  const result = await userServices.selfDestruct(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'your account deletion successful',
    data: result,
  });
});

const uploadOrChangeImg = catchAsync(async (req, res) => {
  const actionType = req.query.actionType as string;
  const user_id = req.user.id;

  // FIX: Use req.files, not req.file
  const imgFile =
    req.files && (req.files as any).images
      ? (req.files as any).images[0]
      : null;

  if (!user_id || !imgFile) {
    throw new Error('User ID and image file are required.');
  }

  const userIdConverted = idConverter(user_id);
  if (!(userIdConverted instanceof Types.ObjectId)) {
    throw new Error('User ID conversion failed');
  }

  const result = await userServices.uploadOrChangeImg(
    userIdConverted,
    imgFile as Express.Multer.File,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Your profile picture has been ${actionType || 'updated'}`,
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user_id = req.user.id;
  const converted_user_id = idConverter(user_id);
  if (!converted_user_id) {
    throw Error('id conversation failed');
  }
  const result = await userServices.getProfile(converted_user_id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'your position retrived',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId, role } = req.body;

  const converted_user_id = idConverter(userId);
  if (!converted_user_id) {
    throw Error('id conversion failed');
  }

  // Pass object, not string
  const result = await userServices.updateUser(converted_user_id, { role });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role updated',
    data: result,
  });
});

const userController = {
  createUser,
  getAllUsers,
  updateProfileData,
  deleteSingleUser,
  selfDestruct,
  uploadOrChangeImg,
  getProfile,
  updateUser,
};

export default userController;
