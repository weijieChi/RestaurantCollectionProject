'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColum('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Catagories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColum('Restaurants', 'category_id')
  }
}
