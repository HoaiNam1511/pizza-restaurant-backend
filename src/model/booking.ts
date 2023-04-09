import { DataTypes } from 'sequelize';
import { db } from '../config/connect';

const Booking = db.define('bookings', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    booking_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    booking_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    party_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    table_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Booking;
