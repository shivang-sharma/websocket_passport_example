import { WebSocketServer, WebSocket } from "ws";
import { EventEmitter } from "events";

export type SocketMessage = {
    event: "WATCH" | "EVENT_2" | "EVENT_3",
    message: number | string
}

export interface CustomWebSocket extends WebSocket {
    isAlive: boolean;
}
export type SocketInfo = {
    socket: CustomWebSocket,
    user: number
}
const userSocketMap = new Map<number, SocketInfo>();

export function createWebSocketServer() {
    const webSocketServer: WebSocketServer = new WebSocketServer({
        noServer: true,
    });

    webSocketServer.on("connection", (webSocket: CustomWebSocket, request) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).session?.passport?.user;
        if (!userId) {
            console.error("User ID not found in the session.");
            webSocket.terminate(); // Terminate the WebSocket connection if user ID is missing.
            return;
        }
        userSocketMap.set(userId, { socket: webSocket, user: userId })
        webSocket.isAlive = true;
        webSocket.on("pong", heartbeat);
        webSocket.on("error", (error) => {
            console.error(`Error occurred for userId: ${userId}, error: ${error}`);
        });
        webSocket.on("message", (message) => {
            try {
                const sockMessage: SocketMessage = JSON.parse(message.toString());
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
            } catch (error) {
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
            if ((webSocket as CustomWebSocket).isAlive === false) return webSocket.terminate();
            (webSocket as CustomWebSocket).isAlive = false;
            webSocket.ping();
        });
    }, 30000);

    function heartbeat(this: WebSocket) {
        (this as CustomWebSocket).isAlive = true;
    }

    return webSocketServer;
}
