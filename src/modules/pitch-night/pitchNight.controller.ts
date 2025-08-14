import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConverter';
import sendResponse from '../../util/sendResponse';
import pitchNightServices from './pitchNight.service';

const createPitchNight = catchAsync(async (req, res) => {
  try {
    const userIdConverted = idConverter(req.user.id);
    if (!userIdConverted) {
      throw new Error('user id conversion failed');
    }

    const result = await pitchNightServices.createPitchNight(
      userIdConverted,
      req.body,
      req.files,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Pitch Night Event created successfully',
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

const getAllPitchNight = catchAsync(async (req, res) => {
  const pitchNights = await pitchNightServices.getAllPitchNight();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Pitch Nights retrieved successfully',
    data: pitchNights,
  });
});

const getPitchNightById = catchAsync(async (req, res) => {
  const pitchNightId = req.params.id;
  const pitchNight = await pitchNightServices.getPitchNightById(pitchNightId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Night retrieved successfully',
    data: pitchNight,
  });
});

const updatePitchNight = catchAsync(async (req, res) => {
  const pitchNightId = req.params.id;
  const updateData = req.body;
  const updatedPitchNight = await pitchNightServices.updatePitchNight(
    pitchNightId,
    updateData,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Night updated successfully',
    data: updatedPitchNight,
  });
});

const deletePitchNight = catchAsync(async (req, res) => {
  const pitchNightId = req.params.id;
  const result = await pitchNightServices.deletePitchNight(pitchNightId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Night deleted successfully',
    data: result,
  });
});

const getAllApplicants = catchAsync(async (req, res) => {
  const pitchNightId = req.params.id;
  const applicants = await pitchNightServices.getAllApplicants(pitchNightId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All applicants retrieved successfully',
    data: applicants,
  });
});

const pitchNightController = {
  createPitchNight,
  getAllPitchNight,
  getPitchNightById,
  updatePitchNight,
  deletePitchNight,
  getAllApplicants,
};

export default pitchNightController;
