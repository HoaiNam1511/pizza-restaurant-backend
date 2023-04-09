"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connect_1 = require("../config/connect");
const Booking = connect_1.db.define('bookings', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customer_email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customer_phone: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    booking_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    booking_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    booking_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    party_size: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    note: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    table_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
});
exports.default = Booking;
