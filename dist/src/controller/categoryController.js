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
exports.deleteCategory = exports.updateProduct = exports.create = exports.getAllCategory = void 0;
const category_1 = __importDefault(require("../model/category"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage }).single('image');
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, } = req.query;
        const offSet = (page - 1) * limit;
        const categories = yield category_1.default.findAndCountAll({
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });
        const rowCount = yield category_1.default.count();
        const totalPage = Math.ceil(rowCount / limit);
        if (page) {
            res.send({
                totalPage: totalPage,
                data: categories.rows,
            });
        }
        else {
            res.send({
                data: categories.rows,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllCategory = getAllCategory;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, function () {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let { name, image } = req.body;
            try {
                yield category_1.default.create({
                    name: name,
                    image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
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
    });
});
exports.create = create;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, function () {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let { name, image } = req.body;
            try {
                yield category_1.default.update({
                    name: name,
                    image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
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
    });
});
exports.updateProduct = updateProduct;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
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
