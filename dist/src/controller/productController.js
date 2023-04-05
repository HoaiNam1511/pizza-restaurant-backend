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
exports.deleteProduct = exports.updateProduct = exports.create = exports.getAll = void 0;
const path_1 = __importDefault(require("path"));
const product_1 = __importDefault(require("../model/product"));
const relationModel_1 = require("../model/relationModel");
const multer_1 = __importDefault(require("multer"));
const category_1 = __importDefault(require("../model/category"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage }).single('image');
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, } = req.query;
        const offSet = (page - 1) * limit;
        const allProduct = yield product_1.default.findAndCountAll({
            include: [
                {
                    model: category_1.default,
                    as: 'category',
                },
            ],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });
        const rowCount = yield product_1.default.count();
        const totalPage = Math.ceil(rowCount / limit);
        if (page) {
            res.send({
                totalPage: totalPage,
                data: allProduct.rows,
            });
        }
        else {
            res.send({
                data: allProduct.rows,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAll = getAll;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, function () {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let newProductId;
            let { name, price, material, description, image, categories } = req.body;
            const categoriesArr = JSON.parse(req.body.categories);
            try {
                yield product_1.default.create({
                    name: name,
                    price: price,
                    material: material,
                    description: description,
                    image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                });
            }
            catch (err) {
                console.log(err);
            }
            try {
                newProductId = yield product_1.default.findOne({
                    attributes: ['id'],
                    order: [['id', 'DESC']],
                });
            }
            catch (err) {
                console.log(err);
            }
            const categoryProductId = categoriesArr.map((value, index) => ({
                categoryId: value,
                productId: newProductId.id,
            }));
            try {
                yield relationModel_1.CategoryProduct.bulkCreate(categoryProductId);
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
            let { name, price, material, description, image, categories } = req.body;
            const categoriesArr = JSON.parse(req.body.categories);
            try {
                yield product_1.default.update({
                    name: name,
                    price: price,
                    material: material,
                    description: description,
                    image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                }, {
                    where: {
                        id: id,
                    },
                });
                yield relationModel_1.CategoryProduct.destroy({
                    where: {
                        productId: id,
                    },
                });
            }
            catch (err) {
                console.log(err);
            }
            const categoryProductId = categoriesArr.map((value, index) => ({
                categoryId: value,
                productId: id,
            }));
            try {
                yield relationModel_1.CategoryProduct.bulkCreate(categoryProductId);
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
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield relationModel_1.CategoryProduct.destroy({
            where: {
                productId: id,
            },
        });
        yield product_1.default.destroy({
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
exports.deleteProduct = deleteProduct;
