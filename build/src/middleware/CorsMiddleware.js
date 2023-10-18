"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const whiteList = new Set(["http://localhost:5173", "http://localhost:3006", "http://localhost:5000"]);
const corsOptions = {
    optionsSuccessStatus: 200,
    origin: function (origin, callback) {
        if (!origin || whiteList.has(origin)) {
            callback(null, true);
        }
        else {
            console.error(origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
exports.corsMiddleware = (0, cors_1.default)(corsOptions);
