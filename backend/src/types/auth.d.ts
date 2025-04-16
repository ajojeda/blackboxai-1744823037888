import { Request } from 'express';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  siteId: string;
  isActive: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  timestamp?: Date;
}

export interface TokenPayload {
  id: string;
  email: string;
  roles: string[];
  siteId: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  version: number;
}
