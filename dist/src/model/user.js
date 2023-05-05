"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_role = exports.Role = exports.User = void 0;
const Sequelize = require('sequelize');
const db = require('../config/connectDB');
const { DataTypes } = require('sequelize');
exports.User = db.define('accounts', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});
exports.Role = db.define('role', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
exports.User_role = db.define('account_role', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: exports.User,
            key: 'id',
        },
    },
    RoleId: {
        type: DataTypes.INTEGER,
        references: {
            model: exports.Role,
            key: 'id',
        },
    },
});
exports.Role.belongsToMany(exports.User, { through: exports.User_role, as: 'role' });
exports.User.belongsToMany(exports.Role, { through: exports.User_role, as: 'role' });
module.exports = {
    User: exports.User,
    Role: exports.Role,
    User_role: exports.User_role,
};
