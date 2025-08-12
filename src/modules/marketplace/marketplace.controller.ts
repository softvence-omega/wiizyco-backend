import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import idConverter from '../../util/idConverter';
import marketplaceServices from './marketplace.service';

const submitProject = catchAsync(async (req, res) => {
  const user_id = typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();
  const result = await marketplaceServices.submitProject(user_id, req.body, req.files);

  res.status(200).json({
    message: 'Project created successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const projects = await marketplaceServices.getAllProjects();

  res.status(200).json({
    message: 'Projects retrieved successfully',
    data: projects,
  });
});

const getMyProjects = catchAsync(async (req, res) => {
  const user_id = typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();
  const projects = await marketplaceServices.getMyProjects(user_id);

  res.status(200).json({
    message: 'Projects retrieved successfully',
    data: projects,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const project = await marketplaceServices.getProjectById(projectId);

  res.status(200).json({
    message: 'Project retrieved successfully',
    data: project,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const projectId =
    typeof req.params.id === 'string' ? idConverter(req.params.id) : req.params.id;
  const payload = req.body;
  console.log(payload);

  if (!projectId) {
    throw new Error('Project ID conversion failed');
  }

  const updatedProject = await marketplaceServices.updateProject(projectId, payload);

  res.status(200).json({
    message: 'Project updated successfully',
    data: updatedProject,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const projectId =
    typeof req.params.id === 'string' ? idConverter(req.params.id) : req.params.id;

  if (!projectId) {
    throw new Error('Project ID conversion failed');
  }

  const deletedProject = await marketplaceServices.deleteProject(projectId);

  res.status(200).json({
    message: 'Project deleted successfully',
    data: deletedProject,
  });
});

const marketplaceController = {
  submitProject,
  getAllProjects,
  getMyProjects,
  deleteProject,
  updateProject,
  getProjectById,
};

export default marketplaceController;
