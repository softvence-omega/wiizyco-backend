
import { TProject } from './marketplace.interface';
import { ProjectModel } from './marketplace.model';

const submitProject = async (user_id: string, payload: Partial<TProject>) => {
  try {
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
    return project;
  } catch (error) {
    throw error;
  }
};

const marketplaceServices = {
  submitProject,
  getAllProjects,
  getMyProjects,
  getProjectById,
};

export default marketplaceServices;
