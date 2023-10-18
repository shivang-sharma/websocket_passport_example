"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const LocalStrategy = require('passport-local').Strategy;
const BcryptUtil_1 = require("./BcryptUtil");
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
function verifyCredentialsCallback(email, password, done) {
    (async () => {
        try {
            const userInfoFromDB = await getOneUserByEmailQuery(email);
            const match = await (0, BcryptUtil_1.comparePasswordHash)(password, userInfoFromDB?.password);
            if (match) {
                return done(null, userInfoFromDB);
            }
            else {
                return done(null, false);
            }
        }
        catch (error) {
            if (error.msg === undefined) {
                console.error(`${error.stack}`);
                return done(error);
            }
            else {
                console.error(error.msg);
                return done(null, false);
            }
        }
    })();
}
const localStrategy = new LocalStrategy(customFields, verifyCredentialsCallback);
passport_1.default.use(localStrategy);
/**
 * This is used  for setting the user id as cookie in header
 */
passport_1.default.serializeUser((user, done) => {
    return done(null, user.id);
});
/**
 * This is used  for retrieving the user id from the cookie.
 */
passport_1.default.deserializeUser(function (user, done) {
    let userId;
    (async () => {
        try {
            if (user.constructor.name.localeCompare("Object") === 0) {
                userId = user.id;
            }
            else {
                userId = user;
            }
            const userFromDB = await getOneUserByIdQuery(userId);
            return done(null, userFromDB);
        }
        catch (error) {
            if (error.msg === undefined) {
                console.error(`${error.stack}`);
                return done(error);
            }
            else {
                console.error(error.msg);
                return done(null, false);
            }
        }
    })();
});
function getOneUserByEmailQuery(email) {
    throw new Error('Function not implemented.');
}
function getOneUserByIdQuery(userId) {
    throw new Error('Function not implemented.');
}
exports.default = passport_1.default;
