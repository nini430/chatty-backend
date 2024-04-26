
import {Request, Response} from 'express';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { Signup } from '../signup';
import { CustomError } from '@globals/helpers/error-handler';
import authService from '@services/db/auth.service';
import * as cloudinaryUploads from '@globals/helpers/cloudinary-upload';
import { UserCache } from '@services/redis/user.cache';

jest.useFakeTimers();
jest.mock('@services/queues/base.queue');
jest.mock('@services/queues/auth.queue');
jest.mock('@services/queues/user.queue');
jest.mock('@services/redis/user.cache');
jest.mock('@globals/helpers/cloudinary-upload');



describe('Sign Up', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks();
  });
  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should throw error when username is invalid', ()=>{
    const request = authMockRequest({}, {
      username: '',
      email:'ninako@gmail.com',
      password:'ninako',
      avatarColor: 'red',
      avatarImage: 'avatar.png'
    }) as Request;
    const response: Response = authMockResponse();
    Signup.prototype.create(request, response).catch((err: CustomError)=>{
      expect(err.statusCode).toEqual(400);
      expect(err.serializeErrors().message).toEqual('username is required field');
    });
  });

  it('should throw if usename length is less than minimum', ()=>{
    const request = authMockRequest({}, {
      username:'la',
      email:'ninako@gmail.com',
      password:'ninako',
      avatarColor: 'red',
      avatarImage: 'avatar.png'
    }) as Request;
    const response: Response = authMockResponse();
    Signup.prototype.create(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('username should not be less than 4 characters long');
    });
  });

  it('should throw if username length is greater than maximum', ()=>{
    const request = authMockRequest({}, {
      username:'mathematics',
      email:'ninako@gmail.com',
      password:'ninako',
      avatarColor: 'red',
      avatarImage: 'avatar.png'
    }) as Request;
    const response : Response = authMockResponse();
    Signup.prototype.create(request, response).catch((error:CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.serializeErrors().message).toBe('username should not exceed 8 characters');
    });
  });

  it('should throw if email is not valid', ()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      email:'not valid',
      password:'ninako',
      avatarColor: 'red',
      avatarImage: 'avatar.png'
    }) as Request;

    const response: Response = authMockResponse();
    Signup.prototype.create(request, response).catch((error: CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('invalid email');
    });

  });

  it('should throw if email is speicified', ()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      email:'',
      password:'ninako',
      avatarColor: 'red',
      avatarImage: 'avatar.png'
    }) as Request;

    const response: Response = authMockResponse();
    Signup.prototype.create(request, response).catch((error: CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('email is required field');
    });

  });

  it('should throw if email is speicified', ()=>{
    const request = authMockRequest({}, {
      username:'niniko',
      email:'niniko@gmail.com',
      password:'',
      avatarColor: 'red',
      avatarImage: 'avatar.png'
    }) as Request;

    const response: Response = authMockResponse();
    Signup.prototype.create(request, response).catch((error: CustomError)=>{
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('password is required field');
    });

});

it('should throw if password les less length than minimum', ()=>{
  const request = authMockRequest({}, {
    username:'niniko',
    email:'niniko@gmail.com',
    password:'a',
    avatarColor: 'red',
    avatarImage: 'avatar.png'
  }) as Request;

  const response: Response = authMockResponse();
  Signup.prototype.create(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('password should not be less than 4 characters');
  });


});

it('should throw if password les more length than maximum', ()=>{
  const request = authMockRequest({}, {
    username:'niniko',
    email:'niniko@gmail.com',
    password:'affffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    avatarColor: 'red',
    avatarImage: 'avatar.png'
  }) as Request;

  const response: Response = authMockResponse();
  Signup.prototype.create(request, response).catch((error: CustomError)=>{
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('password should not exceed 8 characters');
  });

});

it('should throw if the user with this username exists', ()=>{
  const request = authMockRequest({}, {
    username:'niniko',
    email:'niniko@gmail.com',
    password:'afffff',
    avatarColor: 'red',
    avatarImage: 'avatar.png'
  }) as Request;
  const response: Response = authMockResponse();
  jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
  Signup.prototype.create(request, response).catch((error: CustomError)=>{
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid credentialls');
  });


});
it('should register user succesfully', async()=>{
  const request = authMockRequest({},{
    username:'niniko',
    email:'niniko@gmail.com',
    password:'afffff',
    avatarColor: 'red',
    avatarImage: 'avatar.png'
  }) as Request;
  const response: Response = authMockResponse();
  const userSpy = jest.spyOn(UserCache.prototype,'saveUserToCache');
  jest.spyOn(authService,'getUserByUsernameOrEmail').mockResolvedValue(null);
  //@ts-ignore
  jest.spyOn(cloudinaryUploads,'uploads').mockImplementation(()=>Promise.resolve({version:'12345',public_id:'4345sdfsfs'}));
  await Signup.prototype.create(request, response);
  expect(request.session?.jwt).toBeDefined();
  expect(response.json).toHaveBeenCalledWith({
    message: 'User created successfully',
    token: request.session?.jwt,
    user: userSpy.mock.calls[0][2]
  });
});


});
