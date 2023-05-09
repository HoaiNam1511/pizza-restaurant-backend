"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    MAILER: process.env.EMAIL_MAILER,
    HOST: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    USERNAME: process.env.EMAIL_USERNAME,
    PASSWORD: process.env.EMAIL_PASSWORD,
    ENCRYPTION: process.env.EMAIL_ENCRYPTION,
    FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
    FROM_NAME: process.env.EMAIL_FROM_NAME,
};
