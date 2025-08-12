import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConverter';
import blogServices from './blog.service';

const createBlog = catchAsync(async (req, res) => {
  const userIdConverted = idConverter(req.user.id);

  if (!(userIdConverted instanceof Types.ObjectId)) {
    throw new Error('User ID conversion failed');
  }
  const result = await blogServices.createBlog(userIdConverted, req.body, req.files);
  res.status(200).json({
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogServices.getAllBlogs();
  res.status(200).json({
    message: 'Blogs retrieved successfully',
    data: result,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.getBlogById(id);
  res.status(200).json({
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const getMyBlogs = catchAsync(async (req, res) => {
    const user_id = typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();

  if (!user_id) {
    throw new Error('User ID not found');
  }
  const result = await blogServices.getMyBlogs(user_id);
  res.status(200).json({
    message: 'My blogs retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.updateBlog(id, req.body, req.files);
  res.status(200).json({
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  await blogServices.deleteBlog(id);
  res.status(200).json({
    message: 'Blog deleted successfully',
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
