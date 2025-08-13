import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConverter';
import successStoryServices from './success.service';

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
  res.status(200).json({
    message: 'Success story created successfully',
    data: result,
  });
});

const getAllSuccessStories = catchAsync(async (req, res) => {
  const result = await successStoryServices.getAllSuccessStories();
  res.status(200).json({
    message: 'Success stories retrieved successfully',
    data: result,
  });
});

const getSuccessStoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await successStoryServices.getSuccessStoryById(id);
  res.status(200).json({
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
  res.status(200).json({
    message: 'My success stories retrieved successfully',
    data: result,
  });
});

const updateSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await successStoryServices.updateSuccessStory(id, req.body, req.files);
  res.status(200).json({
    message: 'Success story updated successfully',
    data: result,
  });
});

const deleteSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await successStoryServices.deleteSuccessStory(id);
  res.status(200).json({
    message: 'Success story deleted successfully',
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
