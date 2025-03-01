import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { supabase } from '../supabase/client';
import { hasRole } from '../auth/permissions';

// Type for API handler
export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

// Interface for middleware options
interface MiddlewareOptions {
  requireAuth?: boolean;
  requiredRole?: string;
  methods?: string[];
}

// Default middleware options
const defaultOptions: MiddlewareOptions = {
  requireAuth: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

// Middleware wrapper for API handlers
export const withApiMiddleware = 
  (handler: ApiHandler, options: MiddlewareOptions = defaultOptions) => 
  async (req: NextApiRequest, res: NextApiResponse) => {
    const mergedOptions = { ...defaultOptions, ...options };
    const { requireAuth, requiredRole, methods } = mergedOptions;
    
    // Check if the HTTP method is allowed
    if (methods && !methods.includes(req.method || 'GET')) {
      return res.status(405).json({ 
        error: `Method ${req.method} Not Allowed` 
      });
    }
    
    // Check authentication if required
    if (requireAuth) {
      try {
        // Get the session token
        const token = await getToken({ req });
        
        if (!token) {
          return res.status(401).json({ 
            error: 'Unauthorized: Authentication required' 
          });
        }
        
        // Add user to request object
        (req as any).user = token;
        
        // Check role if required
        if (requiredRole) {
          const userRole = token.role || 'user';
          
          if (!hasRole(userRole, requiredRole)) {
            return res.status(403).json({ 
              error: 'Forbidden: Insufficient permissions' 
            });
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ 
          error: 'Internal server error during authentication' 
        });
      }
    }
    
    // Proceed to the API handler
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API handler error:', error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          error: 'Internal server error',
          message: error.message 
        });
      }
      
      return res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  };

// Rate limiting middleware
export const withRateLimit = (
  handler: ApiHandler,
  requestsPerMinute: number = 60
) => {
  const ipRequests = new Map<string, { count: number; resetTime: number }>();
  
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = req.headers['x-forwarded-for'] as string || 'unknown';
    const now = Date.now();
    const resetTime = now + 60 * 1000; // 1 minute from now
    
    // Get or create rate limit data for this IP
    let rateData = ipRequests.get(ip);
    
    if (!rateData || now > rateData.resetTime) {
      // Reset if time expired
      rateData = { count: 0, resetTime };
    }
    
    // Increment count
    rateData.count += 1;
    ipRequests.set(ip, rateData);
    
    // Check if rate limit exceeded
    if (rateData.count > requestsPerMinute) {
      return res.status(429).json({ 
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.' 
      });
    }
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', requestsPerMinute.toString());
    res.setHeader('X-RateLimit-Remaining', 
      Math.max(0, requestsPerMinute - rateData.count).toString());
    res.setHeader('X-RateLimit-Reset', 
      Math.ceil(rateData.resetTime / 1000).toString());
    
    // Proceed to the handler
    return handler(req, res);
  };
};

// Combine multiple middleware functions
export const withMiddleware = (
  handler: ApiHandler,
  middlewares: ((handler: ApiHandler) => ApiHandler)[]
) => {
  return middlewares.reduce((h, middleware) => middleware(h), handler);
};