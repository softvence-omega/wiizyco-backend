import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import pitchGuestServices from './pitchGuest.service';

const createPitchGuest = catchAsync(async (req, res) => {
  const payload = req.body;
  const newGuest = await pitchGuestServices.createPitchGuest(
    payload,
    req.files,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Pitch Guest created successfully',
    data: newGuest,
  });
});

const getAllPitchGuests = catchAsync(async (req, res) => {
  const guests = await pitchGuestServices.getAllPitchGuests();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Pitch Guests retrieved successfully',
    data: guests,
  });
});

const getPitchGuestById = catchAsync(async (req, res) => {
  const guestId = req.params.id;
  const guest = await pitchGuestServices.getPitchGuestById(guestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Guest retrieved successfully',
    data: guest,
  });
});

const updatePitchGuest = catchAsync(async (req, res) => {
  const guestId = req.params.id;
  const updateData = req.body;
  if (req.file) updateData.guestImage = req.file.path;

  const updatedGuest = await pitchGuestServices.updatePitchGuest(
    guestId,
    updateData,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Guest updated successfully',
    data: updatedGuest,
  });
});

const deletePitchGuest = catchAsync(async (req, res) => {
  const guestId = req.params.id;
  const result = await pitchGuestServices.deletePitchGuest(guestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pitch Guest deleted successfully',
    data: result,
  });
});

const pitchGuestController = {
  createPitchGuest,
  getAllPitchGuests,
  getPitchGuestById,
  updatePitchGuest,
  deletePitchGuest,
};

export default pitchGuestController;
