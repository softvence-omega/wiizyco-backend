import express from 'express';
import { userRole } from '../../constants';
import auth from '../../middleware/auth';
import userSubscriptionController from './userSubscription.controller';


const userSubscriptionRoutes = express.Router();

userSubscriptionRoutes.get('/get-subscription/:userId', auth(userRole.admin, userRole.user), userSubscriptionController.getUserById);

export default userSubscriptionRoutes;
