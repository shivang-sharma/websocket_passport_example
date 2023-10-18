import { Request, Response, NextFunction } from 'express';

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated() || !req.session || !(req.session as any).passport.user) {
        res.status(400).json('Error not logged in');
    } else {
        next();
    }
}
