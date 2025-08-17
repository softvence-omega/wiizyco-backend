import express from 'express';
import auth from '../../middleware/auth';

import planController from './plan.controller';
import { userRole } from '../../constants';

const planRoutes = express.Router();

planRoutes.post('/create', auth(userRole.admin), planController.createPlan);
planRoutes.patch(
  '/update/:id',
  auth(userRole.admin),
  planController.updatePlan,
);
planRoutes.get(
  '/single/:id',
  auth(userRole.admin, userRole.user),
  planController.getPlanById,
);
planRoutes.get(
  '/all',
  auth(userRole.admin, userRole.user),
  planController.getPlans,
);
planRoutes.delete(
  '/delete/:id',
  auth(userRole.admin),
  planController.deletePlan,
);

export default planRoutes;
