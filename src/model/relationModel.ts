import { DataTypes } from 'sequelize';
import { db } from '../config/connect';
// import Category from './category';
// import Product from './product';
// import { Order } from './order';

export const CategoryProduct = db.define('category_products', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // references: {
        //     model: Category,
        //     key: 'id',
        // },
    },
    productId: {
        type: DataTypes.INTEGER,
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
