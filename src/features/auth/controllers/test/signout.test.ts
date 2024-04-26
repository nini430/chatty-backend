import {Request, Response} from 'express';
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { Signout } from '../signout';

jest.useFakeTimers();

describe('Sign out', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks();
  });
  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  });


  it('should have session as null', ()=>{
    const request = authMockRequest({},{}) as Request;
    const response: Response = authMockResponse();
    Signout.prototype.signout(request, response);
    expect(request.session).toBeNull();
  });

  it('should return correct message and status', async()=>{
    const request = authMockRequest({},{}) as Request;
    const response: Response = authMockResponse();
    await Signout.prototype.signout(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message:'User logged out succesfully',
      token:'',
      user:{}
    });
  });
});
