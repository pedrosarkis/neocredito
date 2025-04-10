import { Request, Response } from 'hyper-express';
import { logger } from '../../utils/logger.js';

export const requestLoggerMiddleware = (req: any, res: any, next: Function) => {
  const start = Date.now();
  const method = req.method;
  const path = req.path;
  
  // Add listener for when response is sent
  (res as any).on('finish', () => {
    const duration = Date.now() - start;
    const status = (res as any).status_code;
    
    logger.request(method, path, status, duration);
  });
  
  next();
}; 