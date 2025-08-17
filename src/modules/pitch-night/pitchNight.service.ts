import { PitchNight } from './pitchNight.model';
import { TPitchNightEvent } from './pitchNight.interface';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';

const createPitchNight = async (
  user_id: Types.ObjectId,
  payload: Partial<TPitchNightEvent>,
  files: Express.Multer.File[] | any,
) => {
  try {
    let eventBannerUrl = '';
    if (files?.images && files.images[0]?.path) {
      eventBannerUrl = await uploadToCloudinary(
        files.images[0].path,
        'pitch-night-banners',
      );
    } else {
      throw new Error('Event banner image is required');
    }

    const newPitchNight = await PitchNight.create({
      user_id,
      ...payload,
      eventBanner: eventBannerUrl,
    });

    return newPitchNight;
  } catch (error) {
    throw error;
  }
};

const getAllPitchNight = async () => {
  try {
    const pitchNights = await PitchNight.find();
    return pitchNights;
  } catch (error) {
    throw error;
  }
};

const getPitchNightById = async (pitchNightId: string) => {
  try {
    const pitchNight = await PitchNight.findById(pitchNightId)
      .populate('guests')
      .populate('applications');
    if (!pitchNight) {
      throw new Error('Pitch Night not found');
    }

    return pitchNight;
  } catch (error) {
    throw error;
  }
};

const updatePitchNight = async (
  pitchNightId: string,
  updateData: Partial<TPitchNightEvent>,
) => {
  try {
    const updatedPitchNight = await PitchNight.findByIdAndUpdate(
      pitchNightId,
      updateData,
      { new: true },
    );

    if (!updatedPitchNight) {
      throw new Error('Pitch Night not found');
    }

    return updatedPitchNight;
  } catch (error) {
    throw error;
  }
};

const deletePitchNight = async (pitchNightId: string) => {
  try {
    const deletedPitchNight = await PitchNight.findByIdAndDelete(pitchNightId);

    if (!deletedPitchNight) {
      throw new Error('Pitch Night not found');
    }

    return deletedPitchNight;
  } catch (error) {
    throw error;
  }
};

const getAllApplicants = async (pitchNightId: string) => {
  try {
    const pitchNight =
      await PitchNight.findById(pitchNightId).populate('applicants');

    if (!pitchNight) {
      throw new Error('Pitch Night not found');
    }

    return pitchNight.applicants;
  } catch (error) {
    throw error;
  }
};

const pitchNightServices = {
  createPitchNight,
  getAllPitchNight,
  getPitchNightById,
  updatePitchNight,
  deletePitchNight,
  getAllApplicants,
};

export default pitchNightServices;
