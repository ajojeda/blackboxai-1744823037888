import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorize, checkSiteAccess, generateToken } from '../../middleware/auth';
import { AuthRequest, AuthUser } from '../../types/auth';
import { AppError } from '../../middleware/errorHandler';

type MockRequest = Partial<AuthRequest> & {
  params: {
    siteId?: string;
  };
};

describe('Auth Middleware', () => {
  let mockReq: MockRequest;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let testUser: AuthUser;

  beforeEach(() => {
    testUser = {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      roles: ['USER'],
      siteId: 'site1',
      isActive: true
    };

    mockReq = {
      headers: {},
      params: {},
      user: undefined
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should throw error if no token provided', async () => {
      await authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          statusCode: 401,
          message: expect.any(String)
        })
      );
    });

    it('should authenticate valid token', async () => {
      const token = generateToken({
        id: testUser.id,
        email: testUser.email,
        roles: testUser.roles,
        siteId: testUser.siteId
      });

      mockReq.headers = {
        authorization: `Bearer ${token}`
      };

      await authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user?.id).toBe(testUser.id);
    });
  });

  describe('authorize', () => {
    beforeEach(() => {
      mockReq.user = testUser;
    });

    it('should allow access for user with required role', () => {
      const authorizeMiddleware = authorize(['USER']);
      authorizeMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for user without required role', () => {
      const authorizeMiddleware = authorize(['ADMIN']);
      authorizeMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          statusCode: 403,
          message: expect.any(String)
        })
      );
    });
  });

  describe('checkSiteAccess', () => {
    beforeEach(() => {
      mockReq.user = testUser;
    });

    it('should allow access to user\'s own site', () => {
      mockReq.params.siteId = testUser.siteId;
      checkSiteAccess(mockReq as AuthRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access to different site', () => {
      mockReq.params.siteId = 'different-site';
      checkSiteAccess(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          statusCode: 403,
          message: expect.any(String)
        })
      );
    });

    it('should allow admin access to any site', () => {
      mockReq.user = {
        ...testUser,
        roles: ['ADMIN']
      };
      mockReq.params.siteId = 'any-site';
      checkSiteAccess(mockReq as AuthRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
