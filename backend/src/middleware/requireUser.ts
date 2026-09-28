import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

// Replaces Clerk's deprecated requireAuth(); relies on clerkMiddleware() registered in server.ts
export function requireUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
