'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        username: Sequelize.STRING(100),
        email: Sequelize.STRING(100),
        password: Sequelize.STRING(255),
        createAt: Sequelize.DATE,
        updateAt: Sequelize.DATE,
      })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
