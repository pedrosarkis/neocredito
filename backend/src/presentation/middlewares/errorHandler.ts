import { Request, Response } from 'hyper-express';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, req: Request, res: any) => {
  console.error('Error:', err);
  
  if (err instanceof AppError) {
    res.status_code = err.statusCode;
    return res.json({
      success: false,
      message: err.message
    });
  }
  
  res.status_code = 500;
  return res.json({
    success: false,
    message: 'Internal server error'
  });
}; 