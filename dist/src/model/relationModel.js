"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryProduct = void 0;
const sequelize_1 = require("sequelize");
const connect_1 = require("../config/connect");
// import Category from './category';
// import Product from './product';
// import { Order } from './order';
exports.CategoryProduct = connect_1.db.define('category_products', {
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        // references: {
        //     model: Category,
        //     key: 'id',
        // },
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        // references: {
        //     model: Product,
        //     key: 'id',
        // },
    },
});
// Category.belongsToMany(Product, {
//     through: 'category_products',
//     as: 'product',
//     foreignKey: 'categoryId',
// });
// Product.belongsToMany(Category, {
//     through: 'category_products',
//     as: 'category',
//     foreignKey: 'productId',
// });
