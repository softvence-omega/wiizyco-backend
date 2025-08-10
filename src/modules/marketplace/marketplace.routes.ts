import express from 'express';
import { userRole } from '../../constants';
import auth from '../../middleware/auth';
import { upload } from '../../util/uploadImgToCloudinary';
import marketplaceController from './marketplace.controller';

const marketplaceRoutes = express.Router();

marketplaceRoutes.get('/', (req, res) => {
  // Logic to list all marketplace items
  res.send('List of marketplace items');
});

marketplaceRoutes.post(
  '/submitProject',
  auth(userRole.user, userRole.admin),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'docs', maxCount: 5 },
  ]),
  marketplaceController.submitProject,
);

marketplaceRoutes.get('/allProjects', marketplaceController.getAllProjects);

marketplaceRoutes.get(
  '/myProjects',
  auth(userRole.user, userRole.admin),
  marketplaceController.getMyProjects,
);

marketplaceRoutes.get('/projects/:id', marketplaceController.getProjectById);



export default marketplaceRoutes;
