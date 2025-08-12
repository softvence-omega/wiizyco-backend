import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constants';
import { upload } from '../../util/uploadImgToCloudinary';
import blogController from './blog.controller';

const blogRoutes = express.Router();

blogRoutes.post(
  '/create',
  auth(userRole.user, userRole.admin),
  upload.fields([
    { name: 'images', maxCount: 3 },
  ]),
  blogController.createBlog,
);
blogRoutes.get('/all', blogController.getAllBlogs);

blogRoutes.get(
  '/singleBlog/:id',
  auth(userRole.user, userRole.admin),
  blogController.getBlogById,
);

blogRoutes.get('/myBlogs', auth(userRole.user, userRole.admin), blogController.getMyBlogs);

blogRoutes.patch(
  '/update/:id',
  auth(userRole.user, userRole.admin),
  upload.fields([
    { name: 'images', maxCount: 3 },
  ]),
  blogController.updateBlog,
);
blogRoutes.delete(
  '/:id',
  auth(userRole.user, userRole.admin),
  blogController.deleteBlog,
);

export default blogRoutes;
