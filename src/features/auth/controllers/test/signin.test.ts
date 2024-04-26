import {Request, Response} from 'express';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { Signin } from '../signin';
import { CustomError } from '@globals/helpers/error-handler';
import authService from '@services/db/auth.service';
import { userService } from '@services/db/user.service';


jest.useFakeTimers();

describe('Sign in', ()=>{

  beforeEach(()=>{
    jest.resetAllMocks();
  });

  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('throw if username is not specified', ()=>{
    const request = authMockRequest({}, {
      username:'',
      password:'ninako'
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('username is required field');
    });
  });
  it('throw if username has less length than minimum', ()=>{
    const request = authMockRequest({}, {
      username:'ni',
      password:'ninako'
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('username should not be less than 4 characters');
    });
  });
  it('throw if username has more chars than maximum', ()=>{
    const request = authMockRequest({}, {
      username:'jkjwlierfwiuerowurowiurowuroeiwurowuir',
      password:'ninako'
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('username should not exceed 8 characters');
    });
  });
  it('throw if password is not specified', ()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      password:''
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('password is required field');
    });
  });
  it('throw if username has less length than minimum', ()=>{
    const request = authMockRequest({}, {
      username:'ni',
      password:'ninako'
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('username should not be less than 4 characters');
    });
  });it('throw if password has less length than minimum', ()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      password:'n'
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('password should not be less than 4 characters long');
    });
  });
  it('throw if password has more length than maxiumum', ()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      password:'nlsruworurslekjfskjhfsdhfkjshkfhsdkfhskdj'
    }) as Request;
    const response: Response = authMockResponse();
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('password should not exceed 8 characters');
    });
  });

  it('throw if user witht his username doesnt exist',()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      password:'niniko'
    }) as Request;
    const response = authMockResponse();
    jest.spyOn(authService,'getUserByUsername').mockResolvedValue(null);
    Signin.prototype.read(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.serializeErrors().message).toBe('Invalid credentials');
    });
  });

  it('user signs in successfully', async()=>{
    const request = authMockRequest({},{
      username:'niniko',
      password: 'niniko'
    }) as Request;
    const response: Response = authMockResponse();
    authMock.comparePassword=()=>Promise.resolve(true);
    jest.spyOn(authService,'getUserByUsername').mockResolvedValue(authMock);
    jest.spyOn(userService, 'findUserByAuthId').mockResolvedValue([{_id: '345353'}]);
    await Signin.prototype.read(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(request.session?.jwt).toBeDefined();
    expect(response.json).toHaveBeenCalledWith({
      message: 'User signed in successfully',
      token: request.session?.jwt,
      user: {_id: '345353', authId: '60263f14648fed5246e322d3',username:'Manny', email:'manny@me.com', avatarColor: '#9c27b0',
      createdAt: '2022-08-31T07:42:24.451Z',uId: '1621613119252066'
    }
    });
  });
});
