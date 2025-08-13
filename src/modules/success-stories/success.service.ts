import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import { TSuccessStory } from './success.interface';
import { SuccessStoryModel } from './success.model';

const createSuccessStory = async (
  user_id: Types.ObjectId,
  payload: Partial<TSuccessStory>,
  files: Express.Multer.File[] | any,
) => {
  try {
    let imageUrls: string[] = [];
    let docUrls: string[] = [];

    // Upload images if provided
    if (files && files.images) {
      imageUrls = await Promise.all(
        files.images.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/images'),
        ),
      );
    }

    // Upload docs if provided
    if (files && files.docs) {
      docUrls = await Promise.all(
        files.docs.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/docs'),
        ),
      );
    }

    // Merge uploads into payload
    payload.documents = {
      images: imageUrls,
      docs: docUrls,
    };
    payload.author = user_id;

    const newSuccessStory = await SuccessStoryModel.create({
      ...payload,
    });
    return newSuccessStory;
  } catch (error) {
    throw error;
  }
};

const getAllSuccessStories = async () => {
  try {
    const successStories = await SuccessStoryModel.find();
    if (!successStories || successStories.length === 0) {
      throw new Error('No success stories found');
    }
    return successStories;
  } catch (error) {
    throw error;
  }
};

const getSuccessStoryById = async (id: string) => {
  try {
    const successStory = await SuccessStoryModel.findById(id);
    if (!successStory) {
      throw new Error('Success story not found');
    }
    return successStory;
  } catch (error) {
    throw error;
  }
};

const getMySuccessStories = async (author: string) => {
  try {
    const successStories = await SuccessStoryModel.find({ author });
    if (!successStories || successStories.length === 0) {
      throw new Error('No success stories found for this user');
    }
    return successStories;
  } catch (error) {
    throw error;
  }
};

const updateSuccessStory = async (
  id: string,
  payload: Partial<TSuccessStory>,
  files: Express.Multer.File[] | any,
) => {
  try {
    let imageUrls: string[] = [];
    let docUrls: string[] = [];

    // Upload images if provided
    if (files && files.images) {
      imageUrls = await Promise.all(
        files.images.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/images'),
        ),
      );
    }

    // Upload docs if provided
    if (files && files.docs) {
      docUrls = await Promise.all(
        files.docs.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/docs'),
        ),
      );
    }

    // Merge uploads into payload
    payload.documents = {
      images: imageUrls,
      docs: docUrls,
    };

    const updatedSuccessStory = await SuccessStoryModel.findByIdAndUpdate(
      id,
      { ...payload, images: imageUrls },
      { new: true },
    );
    return updatedSuccessStory;
  } catch (error) {
    throw error;
  }
};

const deleteSuccessStory = async (id: string) => {
  try {
    const deletedSuccessStory = await SuccessStoryModel.findByIdAndDelete(id);
    if (!deletedSuccessStory) {
      throw new Error('Blog not found');
    }
    return deletedSuccessStory;
  } catch (error) {
    throw error;
  }
};

const successStoryServices = {
  createSuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  updateSuccessStory,
  deleteSuccessStory,
  getMySuccessStories,
};

export default successStoryServices;
