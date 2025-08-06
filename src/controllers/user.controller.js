import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

const getMyProfile = asyncHandler(async (req, res) => {
  // The user object is attached to the request by the verifyJWT middleware
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'User profile fetched successfully'));
});

const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};

  const users = await User.find(filter).select('-password');
  
  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'));
});

export { getMyProfile, getUsers };