'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //Add altering commands here.
        await queryInterface.createTable('accounts', {
            id: {
                type: Sequelize.INTEGER(10),
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
            refresh_token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createAt: Sequelize.DATE,
            updateAt: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('accounts');
    },
};
