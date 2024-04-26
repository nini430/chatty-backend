import { AuthDocument, AuthPayload } from '@auth/interfaces/auth.interface';
import {Response} from 'express';


export const authMockRequest=(sessionData: IJwt,  body: AuthMock, currentUser?: AuthPayload | null, params?: any )=> {
    return {
      session: sessionData,
      body,
      params,
      currentUser
    };
};

export const authMockResponse=(): Response=>{
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
};


export interface IJwt {
  jwt?: string;
}

export interface AuthMock {
  _id?: string;
  username?: string;
  email?: string;
  avatarColor?: string;
  createdAt?: Date | string;
  uId?: string;
  avatarImage?: string;
  password?: string;
  confirmPassword?: string;
}

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  iat: 12345
};

export const authMock = {
  _id: '60263f14648fed5246e322d3',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  password:'niniko',
  avatarColor: '#9c27b0',
  createdAt: '2022-08-31T07:42:24.451Z',
  save: () => {},
  comparePassword: () => true
} as unknown as AuthDocument;
