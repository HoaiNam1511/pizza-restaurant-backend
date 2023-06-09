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
exports.getRole = exports.logout = exports.checkLogin = exports.refreshToken = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = require("../model/account");
const secretKey = '15112001';
const refreshTokenKey = '15112001';
let refreshTokenArr = [];
const generateAccessToken = (account) => {
    return jsonwebtoken_1.default.sign({
        id: account.id,
        role: account.role,
    }, secretKey, { expiresIn: '180s' });
};
const generateRefreshToken = (account) => {
    return jsonwebtoken_1.default.sign({
        id: account.id,
        role: account.role,
    }, refreshTokenKey, { expiresIn: '365d' });
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        let message, accessToken, refreshToken, action;
        const account = yield account_1.Account.findOne({
            attributes: ['id', 'email', 'username', 'status'],
            where: {
                username: username,
                password: password,
            },
            include: [
                {
                    model: account_1.Role,
                    as: 'role',
                },
            ],
        });
        if (account) {
            const accountCookies = {
                id: account.id,
                role: account.role[0].id,
            };
            //Account is active
            if (account.status === true) {
                accessToken = generateAccessToken(accountCookies);
                refreshToken = generateRefreshToken(accountCookies);
                refreshTokenArr.push(refreshToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                message = 'Login success';
                action = 'success';
            }
            else {
                message =
                    'Your account has been disable, please contact admin to active';
                action = 'warning';
            }
        }
        else {
            message = 'Your email or password is not correct';
            action = 'error';
        }
        res.send({
            data: {
                account,
                token: accessToken,
                message,
                action,
            },
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => {
    // Get refresh token from cookies
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.send('You are not authenticated');
    //Check refresh token
    if (!refreshTokenArr.includes(refreshToken)) {
        return res.send('Refresh token is not valid');
    }
    jsonwebtoken_1.default.verify(refreshToken, refreshTokenKey, (err, user) => {
        if (err) {
            console.log(err);
        }
        refreshTokenArr = refreshTokenArr.filter((token) => token !== refreshToken);
        let newAccessToken = generateAccessToken(user);
        let newRefreshToken = generateRefreshToken(user);
        refreshTokenArr.push(newRefreshToken);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            //When deploy change: true
            secure: false,
            path: '/',
            sameSite: 'strict',
        });
        res.send({
            token: newAccessToken,
        });
    });
};
exports.refreshToken = refreshToken;
const checkLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    const id = jsonwebtoken_1.default.verify(token, secretKey);
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
const logout = (req, res, next) => {
    res.clearCookie('refreshToken');
    refreshTokenArr = refreshTokenArr.filter((token) => token !== req.cookies.refreshToken);
    res.send('Logout success');
};
exports.logout = logout;
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield account_1.Role.findAll();
        res.send(result);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getRole = getRole;
