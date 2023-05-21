"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogin = exports.checkAdminRole = exports.verifyToken = void 0;
const account_1 = require("./../model/account");
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
        console.log('You need login');
    }
};
exports.verifyToken = verifyToken;
const checkAdminRole = (req, res, next) => {
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
exports.checkAdminRole = checkAdminRole;
const checkLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    const id = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_KEY);
    const account = yield account_1.Account.findOne({
        where: {
            id: id,
        },
    });
    try {
        if (account.id) {
            req.data = account;
            next();
        }
        else {
            res.send('/login');
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkLogin = checkLogin;
