import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// --- REGISTER (ADMIN ONLY) ---
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  if ([username, password, role].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ username });
  if (existedUser) {
    throw new ApiError(409, 'Username already exists');
  }

  const user = await User.create({
    username: username.toLowerCase(),
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

// --- LOGIN ---
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required');
  }

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select('-password');

  return res.status(200).json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken },
      'User logged in successfully'
    )
  );
});

export { registerUser, loginUser };