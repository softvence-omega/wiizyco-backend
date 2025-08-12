import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import { TBlog } from './blog.interface';
import { BlogModel } from './blog.model';

const createBlog = async (
  user_id: Types.ObjectId,
  payload: Partial<TBlog>,
  files: Express.Multer.File[] | any,
) => {
  try {
    let imageUrls: string[] = [];
    if (files && files.images) {
      imageUrls = await Promise.all(
        files.images.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/images'),
        ),
      );
    }

    payload.author = user_id;
    payload.images = imageUrls;

    const newBlog = await BlogModel.create({ user_id, ...payload });
    return newBlog;
  } catch (error) {
    throw error;
  }
};

const getAllBlogs = async () => {
  try {
    const blogs = await BlogModel.find();
    if (!blogs || blogs.length === 0) {
      throw new Error('No blogs found');
    }
    return blogs;
  } catch (error) {
    throw error;
  }
};

const getBlogById = async (id: string) => {
  try {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

const getMyBlogs = async (author: string) => {
  try {
    const blogs = await BlogModel.find({ author });
    if (!blogs || blogs.length === 0) {
      throw new Error('No blogs found for this user');
    }
    return blogs;
  } catch (error) {
    throw error;
  }
};

const updateBlog = async (
  id: string,
  payload: Partial<TBlog>,
  files: Express.Multer.File[] | any,
) => {
  try {
    let imageUrls: string[] = [];
    if (files && files.images) {
      imageUrls = await Promise.all(
        files.images.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/images'),
        ),
      );
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      { ...payload, images: imageUrls },
      { new: true },
    );
    return updatedBlog;
  } catch (error) {
    throw error;
  }
};

const deleteBlog = async (id: string) => {
  try {
    const deletedBlog = await BlogModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      throw new Error('Blog not found');
    }
    return deletedBlog;
  } catch (error) {
    throw error;
  }
};

const blogServices = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
};

export default blogServices;
