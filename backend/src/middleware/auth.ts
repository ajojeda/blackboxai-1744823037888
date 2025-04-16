import { Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppError } from './errorHandler';
import logger from '../utils/logger';
import { AuthRequest, AuthUser, TokenPayload } from '../types/auth';

export type { AuthRequest };

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-key';
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

const JWT_OPTIONS: SignOptions = { 
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  algorithm: 'HS256'
} as SignOptions;

const REFRESH_OPTIONS: SignOptions = { 
  expiresIn: '7d',
  algorithm: 'HS256'
} as SignOptions;

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    req.user = decoded;
    logger.info('User authenticated', {
      userId: decoded.id,
      roles: decoded.roles,
      siteId: decoded.siteId
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token', { error: error.message });
      next(new AppError('Invalid authentication token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Token expired');
      next(new AppError('Authentication token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const hasAllowedRole = req.user.roles.some(role => allowedRoles.includes(role));
      if (!hasAllowedRole) {
        logger.warn('Unauthorized access attempt', {
          userId: req.user.id,
          userRoles: req.user.roles,
          requiredRoles: allowedRoles,
          path: req.path
        });
        throw new AppError('Insufficient permissions', 403);
      }

      logger.info('User authorized', {
        userId: req.user.id,
        roles: req.user.roles,
        allowedRoles,
        path: req.path
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkSiteAccess = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const requestedSiteId = req.params.siteId || req.body.siteId;
    
    if (requestedSiteId && req.user.siteId !== requestedSiteId && !req.user.roles.includes('ADMIN')) {
      logger.warn('Site access denied', {
        userId: req.user.id,
        userSiteId: req.user.siteId,
        requestedSiteId,
        path: req.path
      });
      throw new AppError('Access to this site is not allowed', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Combine multiple authorization checks
 */
export const requireAuth = (roles: string[] = []) => {
  return [authenticate, authorize(roles), checkSiteAccess];
};

/**
 * Check if user has all required permissions
 */
export const hasPermissions = (user: AuthRequest['user'], requiredRoles: string[]): boolean => {
  if (!user) return false;
  return requiredRoles.every(role => user.roles.includes(role));
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign({ ...payload, version: 1 }, JWT_REFRESH_SECRET, REFRESH_OPTIONS);
};

export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 400);
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as AuthUser;

    const newToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
      siteId: decoded.siteId
    });

    res.json({ token: newToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Refresh token expired', 401));
    } else {
      next(error);
    }
  }
};
