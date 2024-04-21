
import { ObjectId } from 'mongodb';
import {Request, Response} from 'express';
import { JoiValidator } from '@/globals/decorators/joi-validation.decorator';
import { signupSchema } from '../schemes/signup';
import { AuthDocument, SignupData } from '../interfaces/auth.interface';
import authService from '@/services/db/auth.service';
import { BadRequestError } from '@/globals/helpers/error-handler';
import { Helpers } from '@/globals/helpers/helpers';
import { uploads } from '@/globals/helpers/cloudinary-upload';
import { StatusCodes } from 'http-status-codes';
import { UserDocument } from '@/user/interfaces/user.interface';
import { UserCache } from '@/services/redis/user.cache';
import { config } from '@/root/config';
import {omit} from 'lodash';
import { authQueue } from '@/services/queues/auth.queue';
import { userQueue } from '@/services/queues/user.queue';
import jwt from 'jsonwebtoken';

const userCache: UserCache = new UserCache();

export class Signup {
  @JoiValidator(signupSchema)
  public async create(req: Request, res: Response) {
      const {username, email, password, avatarColor, avatarImage}=req.body;

      const checkUserExists: AuthDocument|null = await authService.getUserByUsernameOrEmail(username,email);
      if(checkUserExists) {
        throw new BadRequestError('Invalid credentialls');
      }
      const authId : ObjectId = new ObjectId();
      const userId : ObjectId = new ObjectId();
      const uId : string = `${Helpers.generateRandomNumbers(12)}`;

      const authData = Signup.prototype.signupData({
        _id: authId,
        avatarColor,
        email,
        password,
        uId,
        username
      });
        const result = await uploads(avatarImage, `${userId}`, true, true);
        if(!result?.public_id) {
          throw new BadRequestError('File Upload: Error occured!');
        }

       const userDataForCache: UserDocument = Signup.prototype.userData(authData, userId);
      userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result?.version}/${userId}`;
      await userCache.saveUserToCache(`${userId}`,uId,userDataForCache);
      omit(userDataForCache, ['email', 'password', 'uId', 'avatarColor', 'username']);
      authQueue.addAuthUserJob('addAuthUserToDb', {value: userDataForCache});
      userQueue.addSaveUserJob('saveUserToDb', {value: userDataForCache});

      const token = Signup.prototype.signupToken(authData,userId);

      req.session = {jwt: token};



      return res.status(StatusCodes.CREATED).json({message: 'User created successfully', user: userDataForCache, token});


  }

  private signupToken(data: AuthDocument, userId: ObjectId): string {
      return jwt.sign({
        userId,
        email: data.email,
        username: data.username,
        uId: data.uId,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }

  private signupData(data: SignupData): AuthDocument {
    const {_id, uId, username, email, password, avatarColor}=data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.toLowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as AuthDocument;
  }

  private userData(data: AuthDocument, userObjectId: ObjectId): UserDocument {
    const {_id, username, email, uId, password, avatarColor} = data;

    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        yuttube: ''
      }
    } as unknown as UserDocument;
  }
 }
