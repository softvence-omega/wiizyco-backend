import mongoose, { ClientSession, Types } from 'mongoose';
import { TProfile, TUser } from './user.interface';
import { ProfileModel, UserModel } from './user.model';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';

const createUser = async (
  payload: Partial<TUser>,
  method?: string | number,
) => {
  if (!payload.agreedToTerms) {
    throw new Error('You must agree to the terms and conditions to register.');
  }

  if (typeof payload.age !== 'number') {
    throw new Error('Age is required and must be a number.');
  }
  if (payload.age < 18) {
    throw new Error('You must be at least 18 years old to register.');
  }

  const existingUser = await UserModel.findOne({ email: payload.email }).select(
    '+password',
  );

  if (existingUser) {
    if (!existingUser.isDeleted) {
      return {
        message: 'A user with this email already exists and is active.',
        data: null,
      };
    }
  }

  const session: ClientSession = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      let user;

      if (method) {
        const { password, ...rest } = payload;
        const created = await UserModel.create([rest], { session });
        user = created[0];
      } else {
        user = new UserModel(payload);
        await user.save({ session });
      }

      await ProfileModel.create(
        [
          {
            name: payload.name ?? 'user',
            email: payload.email!,
            age: payload.age,
            user_id: user._id,
          },
        ],
        { session },
      );

      return {
        message: 'User created successfully.',
        data: user,
      };
    });

    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      message: 'User creation failed due to an internal error.',
      data: null,
    };
  } finally {
    session.endSession();
  }
};

const getAllUsers = async () => {
  const result = await UserModel.find();
  return result;
};

const updateProfileData = async (
  user_id: Types.ObjectId,
  payload: Partial<TProfile>,
) => {
  try {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { user_id },
      { $set: payload },
      { new: true },
    );
    return updatedProfile;
  } catch (error) {
    throw error;
  }
};

const deleteSingleUser = async (user_id: Types.ObjectId) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    await UserModel.findOneAndUpdate(
      { _id: user_id },
      { isDeleted: true, email: null },
      { session },
    );
    await ProfileModel.findOneAndUpdate(
      { user_id },
      { isDeleted: true, email: null },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const selfDestruct = async (user_id: Types.ObjectId) => {
  const result = deleteSingleUser(user_id);
  return result;
};

const uploadOrChangeImg = async (
  user_id: Types.ObjectId,
  imgFile: Express.Multer.File,
) => {
  if (!user_id || !imgFile) {
    throw new Error('User ID and image file are required.');
  }

  const result = await uploadToCloudinary(imgFile.path, 'profile/images');

  // console.log(result);

  if (!result) {
    throw new Error('Image upload failed.');
  }

  // Update user profile with new image URL
  const updatedUserProfile = await ProfileModel.findOneAndUpdate(
    { user_id }, // Corrected query (find by user_id, not _id)
    { img: result },
    { new: true },
  );

  if (!updatedUserProfile) {
    throw new Error('Profile not found or update failed.');
  }

  return updatedUserProfile;
};

const getProfile = async (user_id: Types.ObjectId) => {
  const profile = await ProfileModel.findOne({ user_id });

  return profile;
};

const userServices = {
  createUser,
  getAllUsers,
  updateProfileData,
  deleteSingleUser,
  selfDestruct,
  uploadOrChangeImg,
  getProfile,
};

export default userServices;
