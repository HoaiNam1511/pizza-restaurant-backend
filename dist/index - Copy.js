"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require('./src/routers/index');
//import route from './src/routers/index'
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bodyParser = require('body-parser');
const dotenv = __importStar(require("dotenv"));
dotenv.config();
app.use((0, cookie_parser_1.default)());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://pizza-restaurant-deploy.vercel.app',
    ],
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use('/images', express.static('images'));
route(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
