import express from "express";
import compression from "compression";
import helmet from "helmet";
import hpp from "hpp";

import { corsMiddleware } from "./middleware/CorsMiddleware";
import { sessionMiddleware } from "./middleware/SessionMiddleware";
import passport from "./middleware/PassportMiddleware";

export const app = express();

/**
 * Attaching Middlewares
 */
app.disable('x-powered-by');
app.use(compression());
app.use(helmet());
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(hpp());
app.options('*', corsMiddleware);
app.use(corsMiddleware);

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
app.use(sessionMiddleware);

/**
 * This is used to initialize the passport.js whenever a 
 * route request is called.
 */
app.use(passport.initialize());
/**
 * This acts as a middleware to alter the request object and 
 * change the ‘user’ value that is currently the 
 * session id (from the client cookie).
 */
app.use(passport.session());

/**
 * Attaching Routers
 */
app.get("/api/health", (req, res, next) => {
} );