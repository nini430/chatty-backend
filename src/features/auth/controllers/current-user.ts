import { userService } from '@services/db/user.service';
import { UserCache } from '@services/redis/user.cache';
import { UserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const userCache : UserCache = new UserCache();

export class CurrentUser {
  public async read(req: Request, res: Response) {
    let isUser = false;
    let token = null;
    let user = null;
    const cachedUser : UserDocument|null =req.currentUser?.userId?  await userCache.getUserFromCache(`${req.currentUser?.userId}`):null;
    const existingUser = cachedUser? cachedUser: await userService.getUserById(`${req.currentUser?.userId}`);
    if(existingUser) {
      isUser = true;
      token= req.session?.jwt;
      user = existingUser;
    }


    return res.status(StatusCodes.OK).json({token, isUser, user});
  }
}
