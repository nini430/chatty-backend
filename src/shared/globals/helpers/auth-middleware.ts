import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '@root/config';
import { NotAuthorizedError } from './error-handler';
import { AuthPayload } from '@auth/interfaces/auth.interface';

export class AuthMiddlware {
  public verifyUser(req:Request, _res: Response, next: NextFunction) {
    if(!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. please login again');
    }

    try{
      const payload = jwt.verify(req.session!.jwt, config.JWT_TOKEN!) as unknown as AuthPayload;
      req.currentUser = payload;
    }catch(err) {
      throw new NotAuthorizedError('Token is invalid. please try again');
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction) {
     if(!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route');
     }
     next();
  }
}

export const authMiddleware: AuthMiddlware= new AuthMiddlware();

