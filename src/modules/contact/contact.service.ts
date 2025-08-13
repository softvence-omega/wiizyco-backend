import { ContactModel } from './contact.model';
import { TContact } from './contact.interface';

const createContact = async (payload: Partial<TContact>) => {
  try {
    const newContact = await ContactModel.create(payload);
    return newContact;
  } catch (error) {
    throw error;
  }
};

const getAllContacts = async () => {
  try {
    const contacts = await ContactModel.find();
    if (!contacts || contacts.length === 0) {
      throw new Error('No contacts found');
    }
    return contacts;
  } catch (error) {
    throw error;
  }
};
const updateContact = async (id: string, payload: Partial<TContact>) => {
  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedContact) {
      throw new Error('Contact not found');
    }
    return updatedContact;
  } catch (error) {
    throw error;
  }
};

const deleteContact = async (id: string) => {
  try {
    const deletedContact = await ContactModel.findByIdAndDelete(id);
    if (!deletedContact) {
      throw new Error('Contact not found');
    }
    return deletedContact;
  } catch (error) {
    throw error;
  }
};

const contactServices = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};

export default contactServices;
