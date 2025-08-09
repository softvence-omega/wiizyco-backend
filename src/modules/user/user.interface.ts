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
};

export type TProfile = {
  fullName: string;
  phone: string;
  email: string;

  img?: string;
  age?: number;
  gender?: 'male' | 'female';
  hight?: number;
  weight?: number;
  residenceArea?: string;

  user_id: Types.ObjectId;

  isDeleted?: boolean;
};
