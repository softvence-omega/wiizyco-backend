import { Types } from 'mongoose';
import { TUserRole } from '../../constants';

export type TUser = {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  age: number;
  role?: TUserRole;
  isDeleted?: string;
  isBlocked?: boolean;
  isLoggedIn?: boolean;
  loggedOutTime?: Date;
  passwordChangeTime?: Date;
  otp?: string; // hashed, select: false in schema
  otpExpires?: Date;
  otpAttempts?: number;
  otpVerified?: boolean;
};

export type TProfile = {
  fullName: string;
  phone: string;
  email: string;

  img?: string;
  age?: number;
  gender?: 'male' | 'female';
  emailNotifications?: boolean;
  bio?: string;
  linkedInLink?: string;

  user_id: Types.ObjectId;

  isDeleted?: boolean;
};
