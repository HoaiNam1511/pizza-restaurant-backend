"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connect_1 = require("../config/connect");
const Table = connect_1.db.define('tables', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    table_title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    table_size: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    // table_quantity: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
    table_used: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
});
exports.default = Table;
