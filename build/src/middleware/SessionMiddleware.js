"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const ConnectRedis = __importStar(require("connect-redis"));
const RedisStore = ConnectRedis.default;
const Redis_1 = require("../redis/Redis");
const redisStore = new RedisStore({
    client: Redis_1.redisClient,
});
exports.sessionMiddleware = (0, express_session_1.default)({
    store: redisStore,
    secret: 'helloredis',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 3600,
    },
});
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
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.sendStatus(401);
    }
}
exports.isAuth = isAuth;
