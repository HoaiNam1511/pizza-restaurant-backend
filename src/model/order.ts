import { DataTypes } from 'sequelize';
import { db } from '../config/connect';
import Product from './product';

export const Order = db.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    order_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export const Customer = db.define('customers', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export const OrderDetail = db.define('order_details', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,

        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Customer.hasMany(Order, {
    foreignKey: 'customer_id',
});

Order.belongsTo(Customer, {
    foreignKey: 'customer_id',
});

Order.belongsToMany(Product, {
    through: 'order_details',
    as: 'products',
    foreignKey: 'order_id',
});

Product.belongsToMany(Order, {
    through: 'order_details',
    as: 'orders',
    foreignKey: 'product_id',
});
