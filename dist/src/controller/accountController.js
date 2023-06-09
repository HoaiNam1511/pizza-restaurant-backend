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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.update = exports.create = exports.get = void 0;
const sequelize_1 = require("sequelize");
const account_1 = require("../model/account");
//Get account
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, sortBy = "id", orderBy = "DESC", limit = 7, } = req.query;
    const offSet = (page - 1) * limit;
    try {
        const result = yield account_1.Account.findAndCountAll({
            attributes: ["id", "email", "username", "password", "status"],
            include: [
                {
                    model: account_1.Role,
                    attributes: ["id", "name", "description"],
                    as: "role",
                    through: { attributes: [] },
                },
            ],
            required: false,
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });
        const totalPage = Math.ceil(result.count / limit);
        res.send({
            totalPage: totalPage,
            data: result.rows,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.get = get;
//Create account
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, status, role } = req.body;
    let newUser, checkAccountAlready;
    try {
        checkAccountAlready = yield account_1.Account.findOne({
            attributes: ["username"],
            where: {
                [sequelize_1.Op.and]: { username: username, email: email },
            },
        });
        //user already
        if (checkAccountAlready) {
            res.send({
                message: "Username had been already",
                action: "warning",
            });
        }
        else {
            //create new user
            yield account_1.Account.create({
                email: email,
                username: username,
                password: password,
                status: status,
                refresh_token: "",
            });
            //get new id user recent create
            newUser = yield account_1.Account.findOne({
                attributes: ["id"],
                order: [["id", "DESC"]],
            });
            //add role
            yield account_1.Account_role.create({
                accountId: newUser.id,
                roleId: role,
            });
            res.send({
                message: "Add account success",
                action: "add",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.create = create;
//Update account
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, username, password, status, role } = req.body;
    const { actionaccount } = req.headers;
    const { username: currentUsername } = req.user;
    try {
        if (actionaccount !== process.env.ACCOUNT_AUTH) {
            yield account_1.Account.update({
                email: email,
                user_name: username,
                password: password,
                status: status,
            }, {
                where: {
                    id: id,
                },
            });
            yield account_1.Account_role.update({
                roleId: role,
            }, {
                where: {
                    accountId: id,
                },
            });
            res.send({
                message: "Update user success",
                action: "update",
            });
        }
        else {
            if (currentUsername === process.env.ACCOUNT_AUTH) {
                yield account_1.Account.update({
                    password: password,
                }, {
                    where: {
                        id: id,
                    },
                });
                res.send({
                    message: "Update success",
                    action: "update",
                });
            }
            else {
                res.send({
                    message: "You are not auth",
                    action: "warning",
                });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.update = update;
//Delete account
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { actionaccount } = req.headers;
    try {
        if (actionaccount === process.env.ACCOUNT_AUTH) {
            res.send({
                message: "You cannot delete this user",
                action: "warning",
            });
        }
        else {
            yield account_1.Account.destroy({
                where: {
                    id: id,
                },
            });
            yield account_1.Account_role.destroy({
                where: {
                    accountId: id,
                },
            });
            res.send({
                message: "Delete user success",
                action: "delete",
            });
            res.send({
                message: "Delete user success",
                action: "delete",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteAccount = deleteAccount;
