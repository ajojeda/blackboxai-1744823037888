import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import logger, { logError } from '../utils/logger';
import { CustomValidationError, ErrorResponse } from '../types/errors';

// Custom error class for application errors
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Main error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error values
  let statusCode = 500;
  let errorResponse: ErrorResponse = {
    status: 'error',
    message: 'Internal Server Error'
  };

  // Log the error
  logError(err, 'ErrorHandler');

  // Handle specific error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorResponse = {
      status: err.status,
      message: err.message
    };
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse = {
      status: 'fail',
      message: 'Validation Error',
      errors: err as unknown as ValidationError[]
    };
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse = {
      status: 'fail',
      message: 'Invalid token. Please log in again!'
    };
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse = {
      status: 'fail',
      message: 'Your token has expired! Please log in again.'
    };
  }

  // Add stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    logger.error('Error Stack:', err.stack);
  }

  // Log additional request context in case of errors
  logger.error('Error Context:', {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: {
      ...req.headers,
      authorization: req.headers.authorization ? '[REDACTED]' : undefined
    },
    userId: (req as any).user?.id
  });

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Middleware for catching async errors
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not Found error handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Database error handler
export const handleDatabaseError = (error: any): AppError => {
  logger.error('Database Error:', error);
  
  if (error.code === 'ECONNREFUSED') {
    return new AppError('Database connection failed', 503);
  }
  
  if (error.code === '23505') { // Unique violation in PostgreSQL
    return new AppError('Duplicate entry found', 409);
  }
  
  return new AppError('Database error occurred', 500);
};

// Validation error handler
export const handleValidationError = (errors: CustomValidationError[]): AppError => {
  const errorMessages = errors
    .map(error => `${error.param}: ${error.msg}`)
    .join(', ');
  
  return new AppError(`Validation failed: ${errorMessages}`, 400);
};
