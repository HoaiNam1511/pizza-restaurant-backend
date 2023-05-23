'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            order_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            order_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            order_status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_method: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
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
