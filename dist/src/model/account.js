"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account_role = exports.Role = exports.Account = void 0;
const sequelize_1 = require("sequelize");
const connect_1 = require("../config/connect");
exports.Account = connect_1.db.define('accounts', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
});
exports.Role = connect_1.db.define('role', {
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
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.Account_role = connect_1.db.define('account_role', {
    accountId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: exports.Account,
            key: 'id',
        },
    },
    roleId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: exports.Role,
            key: 'id',
        },
    },
});
exports.Role.belongsToMany(exports.Account, { through: exports.Account_role, as: 'role' });
exports.Account.belongsToMany(exports.Role, { through: exports.Account_role, as: 'role' });
module.exports = {
    Account: exports.Account,
    Role: exports.Role,
    Account_role: exports.Account_role,
};
