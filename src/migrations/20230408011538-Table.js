'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tables', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            table_title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            table_size: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            // table_quantity: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // },
            table_used: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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
