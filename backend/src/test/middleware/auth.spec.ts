import { Response, NextFunction } from 'express';
import { authenticate, authorize, checkSiteAccess, generateToken } from '../../middleware/auth';
import { AuthRequest, AuthUser } from '../../types/auth';
import { AppError } from '../../middleware/errorHandler';

describe('Auth Middleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const testUser: AuthUser = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    roles: ['USER'],
    siteId: 'site1',
    isActive: true
  };

  beforeEach(() => {
    req = {
      headers: {},
      params: {},
      user: undefined
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('authenticate', () => {
    test('should return 401 if no token provided', async () => {
      await authenticate(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          statusCode: 401
        })
      );
    });

    test('should authenticate with valid token', async () => {
      const token = generateToken({
        id: testUser.id,
        email: testUser.email,
        roles: testUser.roles,
        siteId: testUser.siteId
      });

      req.headers = {
        authorization: `Bearer ${token}`
      };

      await authenticate(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(testUser.id);
    });
  });

  describe('authorize', () => {
    beforeEach(() => {
      req.user = testUser;
    });

    test('should allow access with correct role', () => {
      const middleware = authorize(['USER']);
      middleware(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    test('should deny access with wrong role', () => {
      const middleware = authorize(['ADMIN']);
      middleware(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          statusCode: 403
        })
      );
    });
  });

  describe('checkSiteAccess', () => {
    beforeEach(() => {
      req.user = testUser;
      req.params = {};
    });

    test('should allow access to own site', () => {
      req.params.siteId = testUser.siteId;
      checkSiteAccess(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    test('should deny access to different site', () => {
      req.params.siteId = 'different-site';
      checkSiteAccess(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          statusCode: 403
        })
      );
    });

    test('should allow admin access to any site', () => {
      req.user = { ...testUser, roles: ['ADMIN'] };
      req.params.siteId = 'any-site';
      checkSiteAccess(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith();
    });
  });
});
