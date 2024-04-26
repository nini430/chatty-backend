import { AuthDocument } from '@auth/interfaces/auth.interface';
import {model, Model, Schema} from 'mongoose';
import {hash, compare} from 'bcryptjs';

const SALT_ROUND = 10;

const authSchema = new Schema<AuthDocument>({
  username: {type: String},
  uId: {type: String},
  email: {type: String},
  password: {type: String},
  avatarColor: {type: String},
  createdAt: {type: Date, default: Date.now},
  passwordResetToken: {type: String, default:''},
  passwordResetTokenExpire: {type: Number}

},{
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

authSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashedPassword = await (this as AuthDocument).hashPassword(this.password!);
    this.password = hashedPassword;
  }
  done();
});

authSchema.methods.comparePassword=async function(password: string) {
  const isPasswordCorrect = await compare(password, this.password);
  return isPasswordCorrect;
};

authSchema.methods.hashPassword= async function(password: string) {
  const hashedPassword = await hash(password, SALT_ROUND);
  return hashedPassword;
};

const Auth: Model<AuthDocument>  = model<AuthDocument>('Auth', authSchema);

export default Auth;

