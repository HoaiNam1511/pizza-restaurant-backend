"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetail = exports.Customer = exports.Order = void 0;
const sequelize_1 = require("sequelize");
const connect_1 = require("../config/connect");
const product_1 = __importDefault(require("./product"));
exports.Order = connect_1.db.define('orders', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customer_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    order_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    order_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    payment_method: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    payment_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.Customer = connect_1.db.define('customers', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
});
exports.OrderDetail = connect_1.db.define('order_details', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
});
exports.Customer.hasMany(exports.Order, {
    foreignKey: 'customer_id',
});
exports.Order.belongsTo(exports.Customer, {
    foreignKey: 'customer_id',
});
exports.Order.belongsToMany(product_1.default, {
    through: 'order_details',
    as: 'products',
    foreignKey: 'order_id',
});
product_1.default.belongsToMany(exports.Order, {
    through: 'order_details',
    as: 'orders',
    foreignKey: 'product_id',
});
