"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const SessionMiddleware_1 = require("./middleware/SessionMiddleware");
const webSocketServer_1 = require("./webSocketServer");
const port = 5000;
const server = http_1.default.createServer(app_1.app);
const webSocketServer = (0, webSocketServer_1.createWebSocketServer)();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSocketError(err) {
    console.error(err);
}
server.on("upgrade", function (request, socket, head) {
    socket.on('error', onSocketError);
    console.info("Parsing session from request...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (0, SessionMiddleware_1.sessionMiddleware)(request, {}, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!request.session.passport || !request.session.passport.user) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            console.info("Unauthorized");
            return;
        }
        console.info(`Session parsed for Web Socket connection`);
        socket.removeListener('error', onSocketError);
        webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
            webSocketServer.emit('connection', webSocket, request);
        });
    });
});
server.listen(port, () => {
    console.info(`REST Server listening on port ${port}`);
});
