import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import contactServices from './contact.service';

const createContact = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await contactServices.createContact(payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact created successfully',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const result = await contactServices.getAllContacts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.updateContact(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.deleteContact(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  });
});

const contactController = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};

export default contactController;
