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
exports.deleteProduct = exports.updateProduct = exports.create = exports.getOne = exports.filterProduct = exports.search = exports.getAll = void 0;
const sequelize_1 = require("sequelize");
const product_1 = __importDefault(require("../model/product"));
const category_1 = __importDefault(require("../model/category"));
const relationModel_1 = require("../model/relationModel");
const index_1 = require("./index");
//Get all product
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, } = req.query;
        const offSet = (page - 1) * limit;
        const result = yield product_1.default.findAndCountAll({
            include: [
                {
                    model: category_1.default,
                    as: 'categories',
                },
            ],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });
        if (page) {
            const allProduct = yield product_1.default.count();
            const totalPage = Math.ceil(allProduct / limit);
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
exports.getAll = getAll;
//Search product
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        const result = yield product_1.default.findAll({
            where: {
                name: {
                    [sequelize_1.Op.like]: `%${name}%`,
                },
            },
            include: [
                {
                    model: category_1.default,
                    as: 'categories',
                },
            ],
            limit: 10,
        });
        res.send({
            data: result,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.search = search;
//Filter product
const filterProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        const productFilter = yield product_1.default.findAll({
            include: [
                {
                    model: category_1.default,
                    as: 'categories',
                    where: {
                        id: category,
                    },
                },
            ],
        });
        res.send({
            data: productFilter,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.filterProduct = filterProduct;
//Get one product
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_1.default.findOne({
            include: [
                {
                    model: category_1.default,
                    as: 'categories',
                },
            ],
            where: {
                id: id,
            },
        });
        res.send(product);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getOne = getOne;
//Create product
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let newProductId;
    let { name, price, material, description, image, categories } = req.body;
    const categoriesArr = JSON.parse(req.body.categories);
    try {
        yield product_1.default.create({
            name: name,
            price: price,
            material: material,
            description: description,
            image: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '',
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
            message: 'Add product success',
            action: 'add',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.create = create;
//Update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // upload(req, res, async function () {
    const { id } = req.params;
    let { name, price, material, description, image, categories } = req.body;
    const categoriesArr = JSON.parse(req.body.categories);
    (0, index_1.removeImageCloud)({ TableRemove: product_1.default, id: id });
    try {
        yield product_1.default.update({
            name: name,
            price: price,
            material: material,
            description: description,
            image: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
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
            message: 'Update product success',
            action: 'update',
        });
    }
    catch (err) {
        console.log(err);
    }
    // });
});
exports.updateProduct = updateProduct;
//Delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, index_1.removeImageCloud)({ TableRemove: product_1.default, id: id });
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
            message: 'Delete product success',
            action: 'delete',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteProduct = deleteProduct;
