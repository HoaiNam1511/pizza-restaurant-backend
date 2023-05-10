'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bookings', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            customer_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            customer_email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            customer_phone: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            booking_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            booking_time: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            booking_status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            party_size: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            note: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            table_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
