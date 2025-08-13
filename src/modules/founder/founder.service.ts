import { FounderModel } from './founder.model';
import { TFounder, FounderCategory, FounderStatus } from './founder.interface';
import { UserModel } from '../user/user.model';
import { ProjectModel } from '../marketplace/marketplace.model';

// Allowed values from enums
const allowedCategories: FounderCategory[] = [
  'mentorship',
  'partnership',
  'investment',
  'selling',
];

const allowedStatuses: FounderStatus[] = [
  'pending',
  'approved',
  'rejected',
  'banned',
];

const validateFounderData = (payload: Partial<TFounder>) => {
  // Validate category
  if (payload.category) {
    const invalidCategories = payload.category.filter(
      (cat) => !allowedCategories.includes(cat as FounderCategory),
    );
    if (invalidCategories.length > 0) {
      throw new Error(
        `Invalid category value(s): ${invalidCategories.join(', ')}`,
      );
    }
  }

  // Validate status
  if (
    payload.status &&
    !allowedStatuses.includes(payload.status as FounderStatus)
  ) {
    throw new Error(`Invalid status value: ${payload.status}`);
  }
};

const createFounder = async (payload: Partial<TFounder>) => {
  validateFounderData(payload);

  // Check if email already exists
  const emailExists = await FounderModel.findOne({ email: payload.email });
  if (emailExists) {
    throw new Error('Email already exists in founder table');
  }

  // Check if user_id already exists
  const userExists = await FounderModel.findOne({ user_id: payload.user_id });
  if (userExists) {
    throw new Error('User already exists in founder table');
  }

  // Count active projects (status should match your schema's active state)
  const activeProjectCount = await ProjectModel.countDocuments({
    user_id: payload.user_id,
    status: 'Accepted', // Adjust if "active" means something else
  });

  if (activeProjectCount < 1) {
    throw new Error(
      'User must have at least 1 active project to become a founder',
    );
  }

  // Create founder
  const founder = await FounderModel.create(payload);
  return founder;
};

const getAllFounders = async () => {
  return await FounderModel.find();
};

const getFounderById = async (id: string) => {
  const founder = await FounderModel.findById(id);
  if (!founder) throw new Error('Founder not found');
  return founder;
};

const updateFounder = async (id: string, payload: Partial<TFounder>) => {
  validateFounderData(payload);

  const founder = await FounderModel.findById(id);
  if (!founder) throw new Error('Founder not found');

  // If status change affects user role
  if (payload.status === 'approved') {
    const result = await UserModel.findByIdAndUpdate(founder.user_id, {
      role: 'founder',
    });
    console.log("updated",result);
  } else if (payload.status === 'rejected') {
    await UserModel.findByIdAndUpdate(founder.user_id, { role: 'user' });
  }

  const updatedFounder = await FounderModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedFounder;
};

const deleteFounder = async (id: string) => {
  const founder = await FounderModel.findByIdAndDelete(id);
  if (!founder) throw new Error('Founder not found');

  // Set the related user's role back to "user"
  if (founder.user_id) {
    const result = await UserModel.findByIdAndUpdate(founder.user_id, {
      role: 'user',
    });
    console.log(result);
  }

  return founder;
};

const founderServices = {
  createFounder,
  getAllFounders,
  getFounderById,
  updateFounder,
  deleteFounder,
};

export default founderServices;
