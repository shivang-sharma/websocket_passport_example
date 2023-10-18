import passport from 'passport';
import { DoneCallback } from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import { comparePasswordHash } from "./BcryptUtil";
/**
 * @description
 * Custom Field credential Keys
 */
const customFields = {
    usernameField: 'email',
    passwordField: 'password',
};

/**
 * @description
 * Method is used by the passport.js to verify whether the user is valid or not.
 * This method is called during the login phase of the user. 
 * It gets the parameters username and password which then we have to compare
 * with the password present in the MySQL database if the user exists. 
 * For comparison purpose we use comparePasswordHash() method.
 * 
 * @param {String} username 
 * @param {String} password 
 * @param {DoneCallback} done 
 */
function verifyCredentialsCallback(email: string, password: string, done: DoneCallback) {
    (async () => {
        try {
            const userInfoFromDB: User | undefined = await getOneUserByEmailQuery(email);
            const match = await comparePasswordHash(password, userInfoFromDB?.password as string);
            if (match) {
                return done(null, userInfoFromDB);
            } else {
                return done(null, false);
            }
        } catch (error: any) {
            if (error.msg === undefined) {
                console.error(`${error.stack}`);
                return done(error);
            } else {
                console.error(error.msg);
                return done(null, false);
            }
        }
    })();
}

const localStrategy = new LocalStrategy(customFields, verifyCredentialsCallback);
passport.use(localStrategy);

/**
 * This is used  for setting the user id as cookie in header
 */
passport.serializeUser((user: any, done) => {
    return done(null, user.id);
});

/**
 * This is used  for retrieving the user id from the cookie.
 */
passport.deserializeUser(function (user: any, done) {
    let userId;
    (async () => {
        try {
            if (user.constructor.name.localeCompare("Object") === 0) {
                userId = user.id;
            } else {
                userId = user;
            }
            const userFromDB: User | undefined = await getOneUserByIdQuery(userId);
            return done(null, userFromDB);
        } catch (error: any) {
            if (error.msg === undefined) {
                console.error(`${error.stack}`);
                return done(error);
            } else {
                console.error(error.msg);
                return done(null, false);
            }
        }

    })();
});
type User = {
    password: string
}
function getOneUserByEmailQuery(email: string): any {
    throw new Error('Function not implemented.');
}

function getOneUserByIdQuery(userId: number): any {
    throw new Error('Function not implemented.');
}

export default passport;