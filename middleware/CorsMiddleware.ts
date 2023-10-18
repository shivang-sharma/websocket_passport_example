import cors from 'cors';
const whiteList = new Set(["http://localhost:5173", "http://localhost:3006", "http://localhost:5000"]);
const corsOptions = {
    optionsSuccessStatus: 200, // Some leagacy browser choke on 204
    origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
        if (!origin || whiteList.has(origin)) {
            callback(null, true);
        } else {
            console.error(origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}
export const corsMiddleware = cors(corsOptions);