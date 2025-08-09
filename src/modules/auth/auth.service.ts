import bcrypt from 'bcrypt';
import config from '../../config';
import authUtill from './auth.utill';
import { UserModel } from '../user/user.model';
import idConverter from '../../util/idConverter';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../util/sendEmail';
import userServices from '../user/user.service';

const logIn = async (
  email: string,
  password: string,
  method: 'google' | 'email_Pass' | 'facebook' = 'email_Pass',
) => {
  let user = await UserModel.findOne({ email }).select('+password');

  // console.log("user is",user)

  if (
    (user?.isBlocked || user?.isDeleted || !user) &&
    (method === 'google' || method === 'facebook')
  ) {
    // Optional: archive/rename old user, or just ignore

    // Register a fresh user
    await userServices.createUser(
      {
        email,
        agreedToTerms: true,
      },
      method,
    );

    // Re-fetch new user
    user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('User creation failed');
    }
  }

  // If still no user (and not a social login), throw error
  if (!user) {
    throw new Error('No user found with this email');
  }

  // Deny login for blocked/deleted users for normal email login
  if ((user.isBlocked || user.isDeleted) && method === 'email_Pass') {
    throw new Error('This user is blocked or deleted');
  }

  // Password check for email login
  if (method === 'email_Pass') {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Password is not matched');
    }
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { isLoggedIn: true },
    { new: true },
  );

  const tokenizeData = {
    id: user._id.toHexString(),
    role: user.role,
    username: updatedUser?.name,
  };

  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn,
  );

  const refreshToken = authUtill.createToken(
    tokenizeData,
    config.jwt_refresh_Token_secret,
    config.rifresh_expairsIn,
  );

  return { approvalToken, refreshToken, updatedUser };
};

const logOut = async (userId: string) => {
  const convertedId = idConverter(userId);

  const findUserById = await UserModel.findOneAndUpdate(
    { _id: convertedId },
    { isLoggedIn: false, loggedOutTime: new Date() },
    { new: true },
  );
  return findUserById;
};

const changePassword = async (
  authorizationToken: string,
  oldPassword: string,
  newPassword: string,
) => {
  try {
    // Decode the token
    const decoded = jwt.verify(
      authorizationToken,
      config.jwt_token_secret as string,
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      throw new Error('Invalid or unauthorized token');
    }

    const userId = decoded.id;

    // Find the user and include the password field
    const findUser = await UserModel.findOne({ _id: userId })
      .select('+password')
      .lean(); // Convert to a plain object for performance

    if (!findUser || !findUser.password) {
      throw new Error('User not found or password missing');
    }

    // Compare old password with hashed password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      findUser.password,
    );

    if (!isPasswordMatch) {
      throw new Error('Old password is incorrect');
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt),
    );

    // Update the password
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        password: newPasswordHash,
        passwordChangeTime: new Date(),
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('Error updating password');
    }

    return { success: true, message: 'Password changed successfully' };
  } catch (error: any) {
    console.error('Error changing password:', error.message);
    throw new Error(error.message || 'Something went wrong');
  }
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_Token_secret as string,
  );

  if (!decoded) {
    throw Error('tocan decodaing Failed');
  }

  const { id, iat, role } = decoded as JwtPayload;

  const findUser = await UserModel.findOne({
    _id: id,
    isDelited: false,
  });

  if (!findUser) {
    throw Error('Unauthorised User or forbitten Access');
  }

  // console.log(findUser)
  if ((findUser.passwordChangeTime || findUser.loggedOutTime) && iat) {
    const passwordChangedAt = findUser.passwordChangeTime
      ? new Date(findUser.passwordChangeTime).getTime() / 1000
      : null;

    const logOutTimedAt = findUser.loggedOutTime
      ? new Date(findUser.loggedOutTime).getTime() / 1000
      : null;

    if (
      (passwordChangedAt && passwordChangedAt > iat) ||
      (logOutTimedAt && logOutTimedAt > iat)
    ) {
      throw Error('Unauthorized User: Try logging in again');
    }
  }

  const JwtPayload = {
    id: findUser.id,
    role: role,
  };
  const approvalToken = authUtill.createToken(
    JwtPayload,
    config.jwt_token_secret as string,
    config.token_expairsIn as string,
  );

  return {
    approvalToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found with this email');
  }

  if (user.isDeleted) {
    throw new Error('This user is deleted. This function is not available.');
  }

  const tokenizeData = {
    id: user._id,
    role: user.role,
  };

  const resetToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret as string,
    config.token_expairsIn as string,
  );

  const resetLink = `${config.FrontEndHostedPort}?id=${user._id}&token=${resetToken}`;

  const passwordResetHtml = `
    <div>
      <p>Dear User,</p>
      <p>Click the button below to reset your password. This link expires in 10 minutes.</p> 
      <p>
          <a href="${resetLink}" target="_blank">
              <button style="padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px;">
                  Reset Password
              </button>
          </a>
      </p>
    </div>
  `;

  const emailResponse = await sendEmail(
    user.email,
    'Reset Your Password',
    passwordResetHtml,
  );

  if (emailResponse.success) {
    return {
      success: true,
      message: '✅ Check your email for the reset password link.',
      emailSentTo: emailResponse.accepted,
      resetLink,
    };
  } else {
    return {
      success: false,
      message: '❌ Failed to send password reset email.',
      error: emailResponse.error,
    };
  }
};

const resetPassword = async (
  authorizationToken: string,
  userId: string,
  newPassword: string,
) => {
  // Decode the token
  const decoded = jwt.verify(
    authorizationToken,
    config.jwt_token_secret as string,
  ) as JwtPayload;

  if (!decoded || !decoded.id) {
    throw Error('Invalid or unauthorized token');
  }

  const { id } = decoded;
  if (id === userId) {
    // Find the user and include the password field
    const findUser = await UserModel.findOne({ _id: id }).select('+password');

    if (!findUser || !findUser.password) {
      throw Error('User not found or password missing');
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt),
    );

    // Update the user's password and passwordChangeTime
    const updatePassword = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        password: newPasswordHash,
        passwordChangeTime: new Date(),
      },
      { new: true },
    );

    if (!updatePassword) {
      throw Error('Error updating password');
    }

    return { passwordChanged: true };
  } else {
    throw Error('Invalid User');
  }
};

const collectProfileData = async (id: string) => {
  const result = await UserModel.findOne({ _id: id });
  return result;
};

const authServices = {
  logIn,
  logOut,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  collectProfileData,
};
export default authServices;
