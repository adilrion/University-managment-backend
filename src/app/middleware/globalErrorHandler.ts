import { ErrorRequestHandler } from 'express';
import { validationError } from '../../Errors/validationError';
import config from '../../config';
import { IErrorInterface } from '../../interfaces/errorInterface';

import { Error } from 'mongoose';
import { ZodError } from 'zod';
import { ApiError } from '../../Errors/apiError';
import { zodErrorHandler } from '../../Errors/zodErrorHandler';

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = 400;
  let message = error?.message;
  let errorMessage: IErrorInterface[] = error?.message
    ? [{ path: '', message: error?.message }]
    : [];

  if (error?.name === 'ValidationError') {
    const responseError = validationError(error);
    statusCode = responseError.statusCode;
    message = responseError.message;
    errorMessage = responseError.errorMessage;
  } else if (error instanceof ZodError) {
    const responseError = zodErrorHandler(error);

    statusCode = responseError.statusCode;
    message = responseError.message;
    errorMessage = responseError.errorMessage;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessage = error?.message
      ? [{ path: '', message: error?.message }]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessage = error?.message
      ? [{ path: '', message: error?.message }]
      : [];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.env !== 'production' ? error?.stack : 'undefined',
  });
  next();
};
