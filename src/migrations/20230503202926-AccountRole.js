'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //Add altering commands here.

        await queryInterface.createTable('account_roles', {
            accountId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            roleId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            createAt: Sequelize.DATE,
            updateAt: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('account_roles');
    },
};
