import {Request, Response} from 'express';
import { authMockRequest, authMockResponse, authUserPayload } from '@root/mocks/auth.mock';
import { UserCache } from '@services/redis/user.cache';
import { userService } from '@services/db/user.service';
import { CurrentUser } from '../current-user';
import { existingUser } from '@root/mocks/user.mock';

jest.mock('@services/redis/user.cache');

describe('Current user', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks();
  });

  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  });


  it('if user doesnt exist we should get correct response', async()=>{
    const request = authMockRequest({},{}) as Request;
    const response: Response = authMockResponse();
    jest.spyOn(UserCache.prototype,'getUserFromCache').mockResolvedValue(null as any);
    jest.spyOn(userService,'getUserById').mockResolvedValue(null as any);
    await CurrentUser.prototype.read(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      isUser: false,
      token: null,
      user: null
    });

  });

  it('if user exists we should get correct response', async()=>{
    const request = authMockRequest({jwt:'123'},{},authUserPayload) as Request;
    const response: Response = authMockResponse();
    jest.spyOn(UserCache.prototype,'getUserFromCache').mockResolvedValue(existingUser);
    await CurrentUser.prototype.read(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      isUser: true,
      token: '123',
      user: existingUser
    });
  });
});
