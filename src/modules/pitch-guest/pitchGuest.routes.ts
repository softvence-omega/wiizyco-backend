import express from 'express';
import { upload } from '../../util/uploadImgToCloudinary';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import pitchGuestController from './pitchGuest.controller';

const pitchGuestRoutes = express.Router();

// Create a pitch guest
pitchGuestRoutes.post(
  '/create',
  auth(userRole.admin),
  upload.fields([{ name: 'images', maxCount: 1 }]),
  pitchGuestController.createPitchGuest,
);

// Get all pitch guests
pitchGuestRoutes.get('/all', pitchGuestController.getAllPitchGuests);

// Get a pitch guest by ID
pitchGuestRoutes.get('/single/:id', pitchGuestController.getPitchGuestById);

// Update a pitch guest
pitchGuestRoutes.patch(
  '/update/:id',
  auth(userRole.admin),
  upload.single('guestImage'),
  pitchGuestController.updatePitchGuest,
);

// Delete a pitch guest
pitchGuestRoutes.delete(
  '/delete/:id',
  auth(userRole.admin),
  pitchGuestController.deletePitchGuest,
);

export default pitchGuestRoutes;
