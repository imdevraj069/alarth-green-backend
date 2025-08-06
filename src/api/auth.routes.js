import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route
router.route('/login').post(loginUser);

// Admin-only route
router.route('/register').post(verifyJWT, authorizeRoles('Admin'), registerUser);

export default router;