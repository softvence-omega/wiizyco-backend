import express from 'express';
import authRouter from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import marketplaceRoutes from '../modules/marketplace/marketplace.routes';

const Routes = express.Router();
// Array of module routes
const moduleRouts = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/users',
    router:userRoutes,
  },{
    path: '/marketplace',
    router: marketplaceRoutes,
  }
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
