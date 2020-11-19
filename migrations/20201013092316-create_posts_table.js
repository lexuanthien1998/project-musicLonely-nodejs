'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      title: Sequelize.STRING(500),
      description: Sequelize.STRING(1000),
      content: Sequelize.STRING(10000),
      image: Sequelize.STRING(500),
      userID: Sequelize.INTEGER(11),
      author: Sequelize.STRING(100),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts');
  }
};
