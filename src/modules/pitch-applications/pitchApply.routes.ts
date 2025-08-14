import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import pitchApplicationController from './pitchApply.controller';
import { upload } from '../../util/uploadImgToCloudinary';

const pitchApplicationRoutes = express.Router();

pitchApplicationRoutes.post(
  '/apply',
  auth(userRole.user, userRole.reviver, userRole.founder),
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'documents', maxCount: 4 },
  ]),
  pitchApplicationController.submitPitchApplication,
);

// Get all applicants for a specific pitch night
pitchApplicationRoutes.get(
  '/event/:eventId',
  auth(userRole.admin),
  pitchApplicationController.getAllApplicants,
);

// Get a specific pitch application by ID
pitchApplicationRoutes.get(
  '/single/:id',
  auth(userRole.admin, userRole.admin, userRole.reviver, userRole.founder),
  pitchApplicationController.getPitchApplicationById,
);

// Update a pitch application
pitchApplicationRoutes.patch(
  '/update/:id',
  auth(userRole.admin),
  pitchApplicationController.updatePitchApplication,
);

// Delete a pitch application
pitchApplicationRoutes.delete(
  '/delete/:id',
  auth(userRole.admin),
  pitchApplicationController.deletePitchApplication,
);

export default pitchApplicationRoutes;
