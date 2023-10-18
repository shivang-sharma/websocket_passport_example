"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketServer = void 0;
const ws_1 = require("ws");
const userSocketMap = new Map();
function createWebSocketServer() {
    const webSocketServer = new ws_1.WebSocketServer({
        noServer: true,
    });
    webSocketServer.on("connection", (webSocket, request) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = request.session?.passport?.user;
        if (!userId) {
            console.error("User ID not found in the session.");
            webSocket.terminate(); // Terminate the WebSocket connection if user ID is missing.
            return;
        }
        userSocketMap.set(userId, { socket: webSocket, user: userId });
        webSocket.isAlive = true;
        webSocket.on("pong", heartbeat);
        webSocket.on("error", (error) => {
            console.error(`Error occurred for userId: ${userId}, error: ${error}`);
        });
        webSocket.on("message", (message) => {
            try {
                const sockMessage = JSON.parse(message.toString());
                switch (sockMessage.event) {
                    case "WATCH":
                        // handle the event
                        console.debug(`WATCH event recieved for userId: ${userId}, message: ${sockMessage.message}`);
                        break;
                    case "EVENT_2":
                        // handle the event
                        console.debug(`EVENT_2 event recieved for userId: ${userId}, message: ${sockMessage.message}`);
                        break;
                    case "EVENT_3":
                        // handle the event
                        console.debug(`EVENT_3 event recieved for userId: ${userId}, message: ${sockMessage.message}`);
                        break;
                    default:
                        console.debug(`Received unknown event: ${sockMessage.event} and message: ${message} from userId: ${userId}`);
                }
            }
            catch (error) {
                console.error(`Error while handling message: ${message} from user: ${userId}, error: ${error}`);
            }
        });
        webSocket.on("close", () => {
            console.info(`Connection closed for userId: ${userId}`);
            userSocketMap.delete(userId);
            clearInterval(interval);
        });
    });
    const interval = setInterval(function ping() {
        webSocketServer.clients.forEach(function each(webSocket) {
            if (webSocket.isAlive === false)
                return webSocket.terminate();
            webSocket.isAlive = false;
            webSocket.ping();
        });
    }, 30000);
    function heartbeat() {
        this.isAlive = true;
    }
    return webSocketServer;
}
exports.createWebSocketServer = createWebSocketServer;
