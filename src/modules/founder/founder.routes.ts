import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import founderController from './founder.controller';

const founderRoutes = express.Router();

founderRoutes.post(
  '/create',
  auth(userRole.user),
  founderController.createFounder,
);

founderRoutes.get(
  '/all',
  auth(userRole.admin),
  founderController.getAllFounders,
);

founderRoutes.get(
  '/single/:id',
  auth(userRole.admin, userRole.user),
  founderController.getFounderById,
);

founderRoutes.patch(
  '/update/:id',
  auth(userRole.admin),
  founderController.updateFounder,
);

founderRoutes.delete(
  '/delete/:id',
  auth(userRole.admin),
  founderController.deleteFounder,
);

export default founderRoutes;
