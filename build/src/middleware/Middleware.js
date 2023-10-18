"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
function authenticationMiddleware(req, res, next) {
    if (!req.isAuthenticated() || !req.session || !req.session.passport.user) {
        res.status(400).json('Error not logged in');
    }
    else {
        next();
    }
}
exports.authenticationMiddleware = authenticationMiddleware;
