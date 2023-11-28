import mongoose, { Document, Model, Schema } from 'mongoose';
import brypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    url: string;
    public_id: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: 'Please enter a valid email',
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    avatar: {
      url: String,
      public_id: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await brypt.hash(this.password, 10);
  next();
});

// Sign JWT access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
    expiresIn: '5m',
  });
};

// Sign JWT refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
    expiresIn: '3d',
  });
};

// Compare password
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await brypt.compare(password, this.password);
};

const userModel: Model<IUser> = mongoose.model('User', userSchema);

export default userModel;
