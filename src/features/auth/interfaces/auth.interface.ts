import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import { UserDocument } from '@/user/interfaces/user.interface';


declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}


export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  iat?: number;
}

export interface AuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  comparePassword: (password: string)=>Promise<boolean>
  hashPassword: (password: string)=>Promise<string>
}

export interface SignupData {
  _id: string | ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}

export interface AuthJob {
  value?: string | AuthDocument | UserDocument;
}


