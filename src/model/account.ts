import { DataTypes } from 'sequelize';
import { db } from '../config/connect';

export const Account = db.define('accounts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

export const Role = db.define('role', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export const Account_role = db.define('account_role', {
    accountId: {
        type: DataTypes.INTEGER,
        references: {
            model: Account,
            key: 'id',
        },
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id',
        },
    },
});

Role.belongsToMany(Account, { through: Account_role, as: 'role' });
Account.belongsToMany(Role, { through: Account_role, as: 'role' });

module.exports = {
    Account,
    Role,
    Account_role,
};
