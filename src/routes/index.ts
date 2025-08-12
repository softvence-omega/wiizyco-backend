import express from 'express';
import authRouter from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import marketplaceRoutes from '../modules/marketplace/marketplace.routes';
import blogRoutes from '../modules/blog/blog.routes';
import successRoutes from '../modules/success-stories/success.routes';

const Routes = express.Router();
// Array of module routes
const moduleRouts = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/users',
    router: userRoutes,
  },
  {
    path: '/marketplace',
    router: marketplaceRoutes,
  },
  {
    path: '/blog',
    router: blogRoutes,
  },
  {
    path: '/success-stories',
    router: successRoutes,
  }
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
