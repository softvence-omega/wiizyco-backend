import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConverter';
import successStoryServices from './success.service';
import sendResponse from '../../util/sendResponse';

const createSuccessStory = catchAsync(async (req, res) => {
  const userIdConverted = idConverter(req.user.id);

  if (!(userIdConverted instanceof Types.ObjectId)) {
    throw new Error('User ID conversion failed');
  }
  const result = await successStoryServices.createSuccessStory(
    userIdConverted,
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success story created successfully',
    data: result,
  });
});

const getAllSuccessStories = catchAsync(async (req, res) => {
  const result = await successStoryServices.getAllSuccessStories();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success stories retrieved successfully',
    data: result,
  });
});

const getSuccessStoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await successStoryServices.getSuccessStoryById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success story retrieved successfully',
    data: result,
  });
});

const getMySuccessStories = catchAsync(async (req, res) => {
  const user_id =
    typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();

  if (!user_id) {
    throw new Error('User ID not found');
  }
  const result = await successStoryServices.getMySuccessStories(user_id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My success stories retrieved successfully',
    data: result,
  });
});

const updateSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await successStoryServices.updateSuccessStory(
    id,
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success story updated successfully',
    data: result,
  });
});

const deleteSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await successStoryServices.deleteSuccessStory(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success story deleted successfully',
    data: result,
  });
});

const successStoryController = {
  createSuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  updateSuccessStory,
  getMySuccessStories,
  deleteSuccessStory,
};

export default successStoryController;
