import { StatusCodes } from 'http-status-codes';
import  {Request, Response} from 'express';


export class Signout {
  async signout(req:Request, res: Response) {
    req.session = null;

    return res.status(StatusCodes.OK).json({message:'User logged out succesfully', user:{}, token:''});
  }
}
