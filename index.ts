import http from "http"
import { app } from "./app"
import { sessionMiddleware } from "./middleware/SessionMiddleware";
import { createWebSocketServer } from "./webSocketServer";

const port = 5000;
const server = http.createServer(app);

const webSocketServer = createWebSocketServer()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSocketError(err: any) {
    console.error(err);
}

server.on("upgrade", function (request, socket, head) {
    socket.on('error', onSocketError);
    console.info("Parsing session from request...")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sessionMiddleware(request as any, {} as any, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(request as any).session.passport || !(request as any).session.passport.user) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            console.info("Unauthorized")
            return;
        }
        console.info(`Session parsed for Web Socket connection`);
        socket.removeListener('error', onSocketError);

        webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
            webSocketServer.emit('connection', webSocket, request);
        })
    })
});

server.listen(port, () => {
    console.info(`REST Server listening on port ${port}`);
})