import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import idConverter from '../../util/idConverter';
import marketplaceServices from './marketplace.service';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
// import userServices from './marketplace.service';

const submitProject = catchAsync(async (req, res) => {
  const user_id = typeof req.user.id === 'string' ? req.user.id : req.user.id.toString();
  const payload = req.body;

  // Upload images
  let imageUrls: string[] = [];
  if (req.files && (req.files as any).images) {
    imageUrls = await Promise.all(
      (req.files as any).images.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.path, "projects/images")
      )
    );
  }

  // Upload docs
  let docUrls: string[] = [];
  if (req.files && (req.files as any).docs) {
    docUrls = await Promise.all(
      (req.files as any).docs.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.path, "projects/docs")
      )
    );
  }

  payload.documents = {
    images: imageUrls,
    docs: docUrls,
  };

  const result = await marketplaceServices.submitProject(user_id, payload);

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

const marketplaceController = {
  submitProject,
  getAllProjects,
  getMyProjects,
  getProjectById,
};

export default marketplaceController;
