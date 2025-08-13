import catchAsync from "../../util/catchAsync";
import contactServices from "./contact.service";

const createContact = catchAsync(async (req, res) => {
  const payload=req.body;
  const result = await contactServices.createContact(payload);
  res.status(200).json({
    message: "Contact created successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const result = await contactServices.getAllContacts();
  res.status(200).json({
    message: "Contacts retrieved successfully",
    data: result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.updateContact(id, req.body);
  res.status(200).json({
    message: "Contact updated successfully",
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  await contactServices.deleteContact(id);
  res.status(200).json({
    message: "Contact deleted successfully",
  });
});

const contactController = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};

export default contactController;
