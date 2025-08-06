import { Request } from '../models/request.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// --- CREATE REQUEST (Agent or Admin) ---
const createRequest = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, 'Title and description are required');
  }

  const request = await Request.create({
    title,
    description,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, request, 'Request created successfully'));
});

// --- ASSIGN REQUEST (Assigner or Admin) ---
const assignRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { installerId } = req.body;

  if (!installerId) {
    throw new ApiError(400, 'Installer ID is required for assignment');
  }

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  request.assignedTo = installerId;
  request.status = 'Assigned';
  await request.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, request, 'Request assigned successfully'));
});

// --- UPDATE STATUS (Assigned Installer) ---
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['In Progress', 'Completed'].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'In Progress' or 'Completed'");
  }

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  // Ensure the user updating the status is the one it's assigned to
  if (request.assignedTo.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You are not assigned to this request');
  }

  request.status = status;
  await request.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, request, 'Request status updated successfully'));
});

// --- GET PERSONAL REQUESTS (Agent or Installer) ---
const getMyRequests = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  let requests;

  if (userRole === 'Agent') {
    requests = await Request.find({ createdBy: req.user._id }).populate('assignedTo', 'username');
  } else if (userRole === 'Installer') {
    requests = await Request.find({ assignedTo: req.user._id }).populate('createdBy', 'username');
  } else {
    // This case should ideally not be hit due to route-level authorization
    requests = [];
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, requests, 'Your requests fetched successfully'));
});

// --- GET ALL REQUESTS (Admin, Assigner, Reviewer) ---
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({})
    .populate('createdBy', 'username role')
    .populate('assignedTo', 'username role');
    
  return res
    .status(200)
    .json(new ApiResponse(200, requests, 'All requests fetched successfully'));
});

export {
  createRequest,
  assignRequest,
  updateRequestStatus,
  getMyRequests,
  getAllRequests,
};