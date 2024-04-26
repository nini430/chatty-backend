import { UserDocument } from '@user/interfaces/user.interface';
import User from '@user/models/user.model';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export class UserService {
  public async createUser(data: UserDocument): Promise<void> {
      await User.create(data);
  }

  public async getUserById(userId: string): Promise<UserDocument> {
      const users: UserDocument[] = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId)
          },

        },
        {
          $lookup:{
            from: 'Auth',
            localField: 'authId',
            foreignField: '_id',
            as:'authId'

          }
        },
        {$project: UserService.prototype.aggregateProject()}
      ]);

      return users[0];
  }

  public async findUserByAuthId(authId: ObjectId| string) {
    return User.aggregate([
      {
        $match: {authId}
      },
      {
        $lookup: { from: 'auth', localField: 'authId', foreignField:'_id', as: 'authId'}
      },
      {
        $project: UserService.prototype.aggregateProject()
      }
    ]);
  }
  private aggregateProject() {
    return {
      _id: 1,
      username: '$authId.username',
      uId:'$authId.uId',
      email:'$authId.email',
      avatarColor:'$authId.avatarColor',
      createdAt: '$authId.createdAt',
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1
    };
  }
}

export const userService = new UserService();

