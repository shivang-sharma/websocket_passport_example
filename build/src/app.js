"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const CorsMiddleware_1 = require("./middleware/CorsMiddleware");
const SessionMiddleware_1 = require("./middleware/SessionMiddleware");
const PassportMiddleware_1 = __importDefault(require("./middleware/PassportMiddleware"));
exports.app = (0, express_1.default)();
/**
 * Attaching Middlewares
 */
exports.app.disable('x-powered-by');
exports.app.use((0, compression_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.set('trust proxy', 1);
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.json());
exports.app.use((0, hpp_1.default)());
exports.app.options('*', CorsMiddleware_1.corsMiddleware);
exports.app.use(CorsMiddleware_1.corsMiddleware);
/**
 * We need a way to store user data between HTTP requests and sessions
 * helps us to do so.When a user visits our site, it creates a new session
 * for the user and assigns them a cookie. Next time the user comes to the site
 * the cookie is checked and the session id which is stored in the cookie is
 * retrieved and searched in the session store. Session store is a place where
 * you store all our data regarding your session. Here we are using Redis as
 * the place where we can store sessions.The table will be automatically
 * created when the server side code is run.
 */
exports.app.use(SessionMiddleware_1.sessionMiddleware);
/**
 * This is used to initialize the passport.js whenever a
 * route request is called.
 */
exports.app.use(PassportMiddleware_1.default.initialize());
/**
 * This acts as a middleware to alter the request object and
 * change the ‘user’ value that is currently the
 * session id (from the client cookie).
 */
exports.app.use(PassportMiddleware_1.default.session());
/**
 * Attaching Routers
 */
exports.app.get("/api/health", (req, res, next) => {
});
