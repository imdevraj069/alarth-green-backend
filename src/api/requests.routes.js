import { Router } from 'express';
import {
  createRequest,
  assignRequest,
  updateRequestStatus,
  getMyRequests,
  getAllRequests,
} from '../controllers/request.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// All request routes require a user to be logged in
router.use(verifyJWT);

// Routes with specific role authorization
router
  .route('/')
  .get(verifyJWT, authorizeRoles('Admin', 'Assigner', 'Reviewer'), getAllRequests);
  
router
  .route('/me')
  .get(verifyJWT, authorizeRoles('Agent', 'Installer'), getMyRequests);
  
router
  .route('/create')
  .post(verifyJWT, authorizeRoles('Admin', 'Agent'), createRequest);

router
  .route('/:id/assign')
  .patch(verifyJWT, authorizeRoles('Admin', 'Assigner'), assignRequest);

router
  .route('/:id/status')
  .patch(verifyJWT, authorizeRoles('Installer'), updateRequestStatus);

export default router;