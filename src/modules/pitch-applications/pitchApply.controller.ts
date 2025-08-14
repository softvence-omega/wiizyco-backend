import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConverter';
import sendResponse from '../../util/sendResponse';
import pitchApplicationServices from './pitchApply.service';

const submitPitchApplication = catchAsync(async (req, res) => {
  try {
    const userIdConverted = idConverter(req.user.id);
    if (!userIdConverted) {
      throw new Error('user id conversion failed');
    }

    const result = await pitchApplicationServices.submitPitchApplication(
      userIdConverted,
      req.body,
      req.files,
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Pitch Application submitted successfully',
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

const getAllApplicants = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const applicants = await pitchApplicationServices.getAllApplicants(eventId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All applicants retrieved successfully',
    data: applicants,
  });
});

const getPitchApplicationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const application =
    await pitchApplicationServices.getPitchApplicationById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Application retrieved successfully',
    data: application,
  });
});

const updatePitchApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedApplication =
    await pitchApplicationServices.updatePitchApplication(id, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Application updated successfully',
    data: updatedApplication,
  });
});

const deletePitchApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await pitchApplicationServices.deletePitchApplication(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Application deleted successfully',
    data: result,
  });
});

const pitchApplicationController = {
  submitPitchApplication,
  getAllApplicants,
  getPitchApplicationById,
  updatePitchApplication,
  deletePitchApplication,
};

export default pitchApplicationController;
