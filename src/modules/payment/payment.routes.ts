import express from 'express';
import paymentController from './payment.controller';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';


const paymentRoutes = express.Router();

paymentRoutes.post('/create-checkout-session', auth(userRole.admin, userRole.user), paymentController.createCheckout);
paymentRoutes.post('/verify-payment', auth(userRole.admin, userRole.user), paymentController.verifyPayment);

export default paymentRoutes;