"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryProduct = void 0;
const sequelize_1 = require("sequelize");
const connect_1 = require("../config/connect");
const category_1 = __importDefault(require("./category"));
const product_1 = __importDefault(require("./product"));
exports.CategoryProduct = connect_1.db.define('category_products', {
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
});
category_1.default.belongsToMany(product_1.default, {
    through: 'category_products',
    as: 'product',
    foreignKey: 'categoryId',
});
product_1.default.belongsToMany(category_1.default, {
    through: 'category_products',
    as: 'category',
    foreignKey: 'productId',
});
