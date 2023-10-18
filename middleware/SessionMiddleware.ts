import session from 'express-session';
import * as ConnectRedis from "connect-redis";
const RedisStore = ConnectRedis.default;
import { redisClient } from '../redis/Redis';
import { Request, Response, NextFunction } from 'express';

const redisStore = new RedisStore({
    client: redisClient,
});
export const sessionMiddleware = session({
    store: redisStore,
    secret: 'helloredis',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 3600,
    },
})
/**
 * It verifies whether the user is authenticated. 
 * The request object would have isAuthenticated() method
 * defined by the passport.js that will check whether 
 * the user is authenticated or not. If it returns false it will
 * send unauthorized status code.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function isAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(401);
    }
}