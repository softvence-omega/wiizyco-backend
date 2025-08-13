import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import contactController from './contact.controller';

const contactRoutes = express.Router();

contactRoutes.post('/create', contactController.createContact);
contactRoutes.get(
  '/all',
  auth(userRole.admin),
  contactController.getAllContacts,
);


contactRoutes.patch(
  '/update/:id',
  auth(userRole.admin),
  contactController.updateContact,
);
contactRoutes.delete(
  '/delete/:id',
  auth(userRole.admin),
  contactController.deleteContact,
);

export default contactRoutes;
