import {Request,Response} from 'express';
import { config } from '@root/config';
import jwt from 'jsonwebtoken';
import { JoiValidator } from '@globals/decorators/joi-validation.decorator';
import { StatusCodes } from 'http-status-codes';
import authService from '@services/db/auth.service';
import { signinSchema } from '../schemes/signin';
import { AuthDocument } from '../interfaces/auth.interface';
import { BadRequestError } from '@globals/helpers/error-handler';
import { userService } from '@services/db/user.service';
export class Signin {
  @JoiValidator(signinSchema)
  async read(req: Request, res: Response) {
      const {username, password}=req.body;

      const existingUser: AuthDocument | null = await authService.getUserByUsername(username);
      if(!existingUser) {
        throw new BadRequestError('Invalid credentials');
      }

      const passwordMatch = await existingUser.comparePassword(password);
      if(!passwordMatch) {
        throw new BadRequestError('Invalid credentials');
      }

      const user = await userService.findUserByAuthId(existingUser._id);
      const token= jwt.sign({
        userId: user[0]._id,
        email: existingUser.email,
        uId: existingUser.uId,
        avatarColor: existingUser.avatarColor,
        username: existingUser.username
      }, config.JWT_TOKEN!);

      req.session = {jwt: token};

      const userDocument = {
        ...user[0],
        authId: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        avatarColor: existingUser.avatarColor,
        uId: existingUser.uId,
        createdAt: existingUser.createdAt

      };

      return res.status(StatusCodes.OK).json({message: 'User signed in successfully', user: userDocument, token});

  }
}
