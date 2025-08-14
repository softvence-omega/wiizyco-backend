import express from 'express';
import { upload } from '../../util/uploadImgToCloudinary';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import pitchGuestController from './pitchGuest.controller';

const pitchGuestRoutes = express.Router();

// Create a pitch guest
pitchGuestRoutes.post(
  '/',
  auth(userRole.admin),
  upload.single('guestImage'), // Upload guest image
  pitchGuestController.createPitchGuest,
);

// Get all pitch guests
pitchGuestRoutes.get('/', pitchGuestController.getAllPitchGuests);

// Get a pitch guest by ID
pitchGuestRoutes.get('/:id', pitchGuestController.getPitchGuestById);

// Update a pitch guest
pitchGuestRoutes.patch('/:id', auth(userRole.admin), upload.single('guestImage'), pitchGuestController.updatePitchGuest);

// Delete a pitch guest
pitchGuestRoutes.delete('/:id', auth(userRole.admin), pitchGuestController.deletePitchGuest);

export default pitchGuestRoutes;
