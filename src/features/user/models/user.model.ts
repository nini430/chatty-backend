import mongoose, { Model } from 'mongoose';
import { UserDocument } from '../interfaces/user.interface';


const userSchema = new mongoose.Schema<UserDocument>({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true},
  profilePicture: {type: String, default: ''},
  postsCount: {type: Number, default: 0},
  followersCount: {type: Number, default: 0},
  followingCount: {type: Number, default: 0},
  blocked: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  blockedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  notifications: {
    reactions: {type: Boolean, default: true},
    comments: {type: Boolean, default: true},
    follows: {type: Boolean, default: true},
    messages: {type: Boolean, default: true}
  },
  social: {
    instagram: {type: String, default: ''},
    facebook: {type: String, default: ''},
    twitter: {type: String, default: ''},
    yuttube: {type: String, default: ''}
  },
  work: {type: String, default: ''},
  school: {type: String, default: ''},
  location: {type: String, default: ''},
  quote: {type: String, default: ''},
  bgImageVersion: {type: String, default: ''},
  bgImageId: {type: String, default: ''}
});


const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;
