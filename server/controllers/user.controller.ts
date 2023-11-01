import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';

// Register user
interface iRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password }: iRegistrationBody = req.body;

      const isEmailExit = await userModel.findOne({ email });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
