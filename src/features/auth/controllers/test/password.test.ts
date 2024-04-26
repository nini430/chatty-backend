import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import {Request, Response} from 'express';
import { Password } from '../password';
import { CustomError } from '@globals/helpers/error-handler';
import authService from '@services/db/auth.service';
import { emailQueue } from '@services/queues/email.queue';

jest.useFakeTimers();
jest.mock('@services/queues/base.queue');
jest.mock('@services/queues/email.queue');
jest.mock('@services/db/auth.service');

describe('Password', ()=>{
  beforeEach(()=>{
    jest.restoreAllMocks();
  });
  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();

  });

  describe('create', ()=>{
    it('should throw if email is invalid', ()=>{
      const req = authMockRequest({}, {
        email: 'nini'
      }) as Request;

      const res: Response = authMockResponse();
      Password.prototype.create(req,res).catch((error: CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('invalid email');
      });
    });

    it('should throw if email doesnt exist', ()=>{
      const req = authMockRequest({}, {
        email: 'niniko@gmail.com'
      }) as Request;

      const res: Response = authMockResponse();
      jest.spyOn(authService,'getUserByEmail').mockResolvedValue(null);
      Password.prototype.create(req,res).catch((error: CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Invalid Credentials');
      });
    });
    it('correct json response is sent', async()=>{
      const req = authMockRequest({}, {
        email: 'niniko@gmail.com'
      }) as Request;

      const res: Response = authMockResponse();
      jest.spyOn(emailQueue,'addEmailJob');
      jest.spyOn(authService,'getUserByEmail').mockResolvedValue(authMock);
      await Password.prototype.create(req,res);
      expect(emailQueue.addEmailJob).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset email sent',
        status: 'ok'
      });
    });
  });

  describe('update', ()=>{
    it('check if password is empty', ()=>{
      const req = authMockRequest({}, {
        password:'',
      }) as Request;
      const res: Response = authMockResponse();
      Password.prototype.update(req,res).catch((error:CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.serializeErrors().message).toBe('password is required field');
      });
    });
    it('should throw if password and confirm passwords are different', ()=>{
      const req = authMockRequest({}, {
        password: 'nini',
        confirmPassword: 'nini2'
      }) as Request;
      const res = authMockResponse();
      Password.prototype.update(req,res).catch((error: CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('passwords must match');
      });
    });

    it('should throw if reset token is expired', async()=>{
      const req = authMockRequest({}, {
        password: 'nini',
        confirmPassword: 'nini'
      },null,{token:'233'}) as Request;
      const res: Response = authMockResponse();
      jest.spyOn(authService,'getUserByPasswordToken').mockResolvedValue(null);
      Password.prototype.update(req,res).catch((error:CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Reset token expired');
      });
    });
  });

  it('should return correct json', async()=>{
    const req = authMockRequest({}, {
      password:'nini',
      confirmPassword:'nini'
    }, null, {token: ''}) as Request;
    const res: Response = authMockResponse();
    jest.spyOn(emailQueue,'addEmailJob');
    jest.spyOn(authService,'getUserByPasswordToken').mockResolvedValue(authMock);
    await Password.prototype.update(req,res);
    expect(emailQueue.addEmailJob).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message:'Password reset successfull'
    });
  });

  


});
