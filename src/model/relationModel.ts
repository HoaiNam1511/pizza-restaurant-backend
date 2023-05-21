import { DataTypes } from 'sequelize';
import { db } from '../config/connect';
import Category from './category';
import Product from './product';

export const CategoryProduct = db.define('category_products', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
    },
});

Category.belongsToMany(Product, {
    through: 'category_products',
    as: 'product',
    foreignKey: 'categoryId',
});

Product.belongsToMany(Category, {
    through: 'category_products',
    as: 'categories',
    foreignKey: 'productId',
});
