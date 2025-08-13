import catchAsync from '../../util/catchAsync';
import founderServices from './founder.service';
import idConverter from '../../util/idConverter';
import sendResponse from '../../util/sendResponse';

const createFounder = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.user_id = idConverter(req.user.id);

  const result = await founderServices.createFounder(payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Founder created successfully',
    data: result,
  });
});

const getAllFounders = catchAsync(async (req, res) => {
  const result = await founderServices.getAllFounders();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Founders retrieved successfully',
    data: result,
  });
});

const getFounderById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await founderServices.getFounderById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Founder retrieved successfully',
    data: result,
  });
});

const updateFounder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await founderServices.updateFounder(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Founder updated successfully',
    data: result,
  });
});

const deleteFounder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await founderServices.deleteFounder(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Founder deleted successfully',
    data: result,
  });
});

const founderController = {
  createFounder,
  getAllFounders,
  getFounderById,
  updateFounder,
  deleteFounder,
};

export default founderController;
