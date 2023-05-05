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
exports.create = void 0;
const user_1 = require("../model/user");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, status, role } = req.body;
    let newUser, checkAccountAlready;
    try {
        checkAccountAlready = yield user_1.User.findOne({
            attributes: ['username'],
            where: { username: username },
        });
        //user already
        if (checkAccountAlready) {
            res.send({
                message: 'Username had been already',
                action: 'warning',
            });
        }
        else {
            //create new user
            yield user_1.User.create({
                email: email,
                username: username,
                password: password,
                status: status,
            });
            //get new id user recent create
            newUser = yield user_1.User.findOne({
                attributes: ['id'],
                order: [['id', 'DESC']],
            });
            //add role
            yield user_1.User_role.create({
                UserId: newUser.id,
                RoleId: role,
            });
            res.send({
                message: 'Add user success',
                action: 'add',
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.create = create;
