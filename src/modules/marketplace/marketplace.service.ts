import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import { TProject } from './marketplace.interface';
import { ProjectModel } from './marketplace.model';

const submitProject = async (
  user_id: string,
  payload: Partial<TProject>,
  files?: Express.Multer.File[] | any,
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

    const newProject = await ProjectModel.create({ user_id, ...payload });
    return newProject;
  } catch (error) {
    throw error;
  }
};

const getAllProjects = async () => {
  try {
    const projects = await ProjectModel.find();
    return projects;
  } catch (error) {
    throw error;
  }
};

const getMyProjects = async (user_id: string) => {
  try {
    const projects = await ProjectModel.find({ user_id });
    return projects;
  } catch (error) {
    throw error;
  }
};

const getProjectById = async (projectId: string) => {
  try {
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new Error('Project not found.');
    }

    return project;
  } catch (error) {
    throw error;
  }
};

const updateProject = async (
  projectId: Types.ObjectId,
  payload: Partial<TProject>,
) => {
  try {
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      payload,
      { new: true },
    );

    if (!updatedProject) {
      throw new Error('Project not found.');
    }

    return updatedProject;
  } catch (error) {
    throw error;
  }
};

const deleteProject = async (projectId: Types.ObjectId) => {
  try {
    const deletedProject = await ProjectModel.findByIdAndDelete(projectId);

    if (!deletedProject) {
      throw new Error('Project not found.');
    }

    return deletedProject;
  } catch (error) {
    throw error;
  }
};

const marketplaceServices = {
  submitProject,
  getAllProjects,
  getMyProjects,
  deleteProject,
  updateProject,
  getProjectById,
};

export default marketplaceServices;
