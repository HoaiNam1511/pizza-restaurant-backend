"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminAuth = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
            if (err) {
                res.send('Token is not valid');
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    else {
        res.send('You need login');
    }
};
exports.verifyToken = verifyToken;
const checkAdminAuth = (req, res, next) => {
    if (req.user.role < 2) {
        next();
    }
    else {
        res.send({
            message: 'This feature only available to Admin account',
            action: 'warning',
        });
    }
};
exports.checkAdminAuth = checkAdminAuth;
