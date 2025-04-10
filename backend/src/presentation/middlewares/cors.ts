import { Request, Response } from 'hyper-express';

export const corsMiddleware = (req: Request, res: Response, next: any) => {
  res.headers['Access-Control-Allow-Origin'] = '*';
  res.headers[
    'Access-Control-Allow-Headers'
  ] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.json();
  }
  
  next();
}; 