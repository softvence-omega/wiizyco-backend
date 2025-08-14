import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import { upload } from '../../util/uploadImgToCloudinary';
import pitchNightController from './pitchNight.controller';

const pitchNightRoutes = express.Router();

pitchNightRoutes.post(
  '/create',
  auth(userRole.admin),
  upload.fields([{ name: 'images', maxCount: 1 }]),
  pitchNightController.createPitchNight,
);

pitchNightRoutes.get(
  '/all',
  auth(userRole.admin, userRole.user),

  pitchNightController.getAllPitchNight,
);

pitchNightRoutes.get(
  '/single/:id',
  auth(userRole.admin),
  pitchNightController.getPitchNightById,
);

pitchNightRoutes.patch(
  '/update/:id',
  auth(userRole.admin),
  pitchNightController.updatePitchNight,
);

pitchNightRoutes.delete(
  '/update/:id',
  auth(userRole.admin),
  pitchNightController.deletePitchNight,
);

pitchNightRoutes.delete(
  '/applicants/:id',
  auth(userRole.admin),
  pitchNightController.getAllApplicants,
);

export default pitchNightRoutes;
