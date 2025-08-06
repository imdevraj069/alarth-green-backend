import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new ApiError(401, 'Unauthorized request: No token provided');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken?._id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    // Catches invalid/expired tokens
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});

export const authorizeRoles = (...roles) => {
  return async (req, _, next) => {
    const userRole =await req.user?.role
    if (!roles.includes(userRole)) {
      throw new ApiError(
        403,
        `Forbidden: Role '${req.user?.role}' is not authorized to access this resource`
      );
    }
    next();
  };
};