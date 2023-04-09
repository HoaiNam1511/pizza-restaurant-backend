import { DataTypes } from 'sequelize';
import { db } from '../config/connect';

const Table = db.define('tables', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    table_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    table_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // table_quantity: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
    table_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

export default Table;
