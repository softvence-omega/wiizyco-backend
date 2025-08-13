import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import idConverter from '../../util/idConverter';
import marketplaceServices from './marketplace.service';

const submitProject = catchAsync(async (req, res) => {
  const user_id =
    typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();
  const result = await marketplaceServices.submitProject(
    user_id,
    req.body,
    req.files,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const projects = await marketplaceServices.getAllProjects();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Projects retrieved successfully',
    data: projects,
  });
});

const getMyProjects = catchAsync(async (req, res) => {
  const user_id =
    typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();
  const projects = await marketplaceServices.getMyProjects(user_id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Projects retrieved successfully',
    data: projects,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const project = await marketplaceServices.getProjectById(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project retrieved successfully',
    data: project,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const projectId =
    typeof req.params.id === 'string'
      ? idConverter(req.params.id)
      : req.params.id;
  const payload = req.body;

  if (!projectId) {
    throw new Error('Project ID conversion failed');
  }

  const updatedProject = await marketplaceServices.updateProject(
    projectId,
    payload,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project updated successfully',
    data: updatedProject,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const projectId =
    typeof req.params.id === 'string'
      ? idConverter(req.params.id)
      : req.params.id;

  if (!projectId) {
    throw new Error('Project ID conversion failed');
  }

  const deletedProject = await marketplaceServices.deleteProject(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
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
