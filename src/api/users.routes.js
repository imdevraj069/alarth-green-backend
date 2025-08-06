import { Router } from 'express';
import { getMyProfile, getUsers } from '../controllers/user.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// This route requires authentication for any role
router.route('/me').get(verifyJWT, getMyProfile);

// GET /api/v1/users (for Admin)
// GET /api/v1/users?role=Installer (for Assigner)
router.route('/').get(verifyJWT, authorizeRoles('Admin', 'Assigner'), getUsers);

export default router;