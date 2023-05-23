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
exports.deleteCategory = exports.updateCategory = exports.create = exports.getAllCategory = void 0;
const category_1 = __importDefault(require("../model/category"));
const index_1 = require("./index");
//Get all category
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, } = req.query;
        const offSet = (page - 1) * limit;
        let queryOptions;
        if (page) {
            queryOptions = {
                offset: page ? offSet : 0,
                limit: limit ? +limit : null,
                order: [[sortBy, orderBy]],
            };
        }
        else {
            queryOptions = {
                order: [[sortBy, orderBy]],
            };
        }
        const result = yield category_1.default.findAndCountAll(queryOptions);
        const totalPage = Math.ceil(result.count / limit);
        if (page) {
            res.send({
                totalPage: totalPage,
                data: result.rows,
            });
        }
        else {
            res.send({
                data: result.rows,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllCategory = getAllCategory;
//Create new category
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { name, image } = req.body;
    try {
        yield category_1.default.create({
            name: name,
            image: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '',
        });
        res.send({
            message: 'Add category success',
            action: 'add',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.create = create;
//Update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    let { name, image } = req.body;
    try {
        (0, index_1.removeImageCloud)({ TableRemove: category_1.default, id: id });
        yield category_1.default.update({
            name: name,
            image: ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || '',
        }, {
            where: {
                id: id,
            },
        });
        res.send({
            message: 'Update category success',
            action: 'update',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateCategory = updateCategory;
//Delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, index_1.removeImageCloud)({ TableRemove: category_1.default, id: id });
        yield category_1.default.destroy({
            where: {
                id: id,
            },
        });
        res.send({
            message: 'Delete category success',
            action: 'delete',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteCategory = deleteCategory;
