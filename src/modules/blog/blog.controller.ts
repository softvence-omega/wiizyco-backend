import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConverter';
import blogServices from './blog.service';
import sendResponse from '../../util/sendResponse';

const createBlog = catchAsync(async (req, res) => {
  const userIdConverted = idConverter(req.user.id);

  if (!(userIdConverted instanceof Types.ObjectId)) {
    throw new Error('User ID conversion failed');
  }
  const result = await blogServices.createBlog(
    userIdConverted,
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogServices.getAllBlogs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs retrieved successfully',
    data: result,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.getBlogById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const getMyBlogs = catchAsync(async (req, res) => {
  const user_id =
    typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();

  if (!user_id) {
    throw new Error('User ID not found');
  }
  const result = await blogServices.getMyBlogs(user_id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My blogs retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.updateBlog(id, req.body, req.files);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.deleteBlog(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

const blogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  getMyBlogs,
  deleteBlog,
};

export default blogController;
