import { ValidationError } from 'express-validator';

export interface CustomValidationError extends ValidationError {
  param: string;
  msg: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  errors?: ValidationError[] | null;
  stack?: string;
}
