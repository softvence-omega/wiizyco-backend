import { PitchApplication } from './pitchApply.model';
import { TPitchApplication } from './pitchApply.interface';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import { PitchNight } from '../pitch-night/pitchNight.model';

const submitPitchApplication = async (
  userId: Types.ObjectId,
  payload: Partial<TPitchApplication>,
  files: Express.Multer.File[] | any,
) => {
  try {
    if (!payload.eventId) throw new Error('Event ID is required');

    if (!payload.eventId) {
      throw new Error('Event ID is required');
    }

    const event = await PitchNight.findById(payload.eventId);
    if (!event) {
      throw new Error('Invalid event — event not found');
    }
    if (event.status !== 'live') {
      throw new Error('Invalid event — event is not live');
    }

    let videoUrl: string = '';
    let docUrls: string[] = [];
    if (files?.video && files.video[0]?.path) {
      videoUrl = await uploadToCloudinary(
        files.video[0].path,
        'pitch-application-videos',
      );
    } else {
      throw new Error('Video file is required');
    }

    // Upload docs if provided
    if (files && files.documents) {
      docUrls = await Promise.all(
        files.documents.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.path, 'projects/docs'),
        ),
      );
    }

    payload.supportingMaterials = {
      video: videoUrl,
      docs: docUrls,
    };

    const newApplication = await PitchApplication.create({
      userId,
      ...payload,
    });
    return newApplication;
  } catch (error) {
    throw error;
  }
};

const getAllApplicants = async (eventId: string) => {
  try {
    const event = await PitchNight.findById(eventId);

    if (!event) throw new Error('Invalid event — event not found');
    const applicants = await PitchApplication.find({ eventId });
    return applicants;
  } catch (error) {
    throw error;
  }
};

const getPitchApplicationById = async (id: string) => {
  try {
    const application = await PitchApplication.findById(id);
    if (!application) throw new Error('Application not found');
    return application;
  } catch (error) {
    throw error;
  }
};

const updatePitchApplication = async (
  id: string,
  updateData: Partial<TPitchApplication>,
) => {
  try {
    const updatedApplication = await PitchApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedApplication) throw new Error('Application not found');
    return updatedApplication;
  } catch (error) {
    throw error;
  }
};

const deletePitchApplication = async (id: string) => {
  try {
    const deletedApplication = await PitchApplication.findByIdAndDelete(id);
    if (!deletedApplication) throw new Error('Application not found');
    return deletedApplication;
  } catch (error) {
    throw error;
  }
};

const pitchApplicationServices = {
  submitPitchApplication,
  getAllApplicants,
  getPitchApplicationById,
  updatePitchApplication,
  deletePitchApplication,
};

export default pitchApplicationServices;
