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
exports.getAll = void 0;
const table_1 = __importDefault(require("../model/table"));
//Get all table
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { used } = req.query;
        let condition = {};
        if (used === 'true') {
            condition = {
                where: {
                    table_used: true,
                },
            };
        }
        else if (used === 'false') {
            condition = {
                where: {
                    table_used: false,
                },
            };
        }
        const result = yield table_1.default.findAll(condition);
        res.send(result);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAll = getAll;
