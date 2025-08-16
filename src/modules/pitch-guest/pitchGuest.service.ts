import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import { TPitchGuest } from './pitchGuest.interface';
import PitchGuest from './pitchGuest.model';

const createPitchGuest = async (
  payload: TPitchGuest,
  files: Express.Multer.File | any,
) => {
  try {
    let img = '';
    if (files?.images && files.images[0]?.path) {
      img = await uploadToCloudinary(
        files.images[0].path,
        'pitch-guest-images',
      );
    }

    const newGuest = await PitchGuest.create({
      ...payload,
      guestImage: img,
    });

    return newGuest;
  } catch (error) {
    throw error;
  }
};

const getAllPitchGuests = async (eventId?: string) => {
  try {
    const query: any = {};
    if (eventId) query.eventId = eventId;

    const guests = await PitchGuest.find(query).populate(
      'eventId',
      'title date',
    );
    return guests;
  } catch (error) {
    throw error;
  }
};

const getPitchGuestById = async (guestId: string) => {
  try {
    const guest = await PitchGuest.findById(guestId).populate(
      'eventId',
      'title date',
    );
    if (!guest) throw new Error('Guest not found');
    return guest;
  } catch (error) {
    throw error;
  }
};

const updatePitchGuest = async (
  guestId: string,
  updateData: Partial<TPitchGuest>,
) => {
  try {
    const updatedGuest = await PitchGuest.findByIdAndUpdate(
      guestId,
      updateData,
      { new: true },
    ).populate('eventId', 'title date');
    if (!updatedGuest) throw new Error('Guest not found');
    return updatedGuest;
  } catch (error) {
    throw error;
  }
};

const deletePitchGuest = async (guestId: string) => {
  try {
    const deletedGuest = await PitchGuest.findByIdAndDelete(guestId);
    if (!deletedGuest) throw new Error('Guest not found');
    return deletedGuest;
  } catch (error) {
    throw error;
  }
};

export default {
  createPitchGuest,
  getAllPitchGuests,
  getPitchGuestById,
  updatePitchGuest,
  deletePitchGuest,
};
