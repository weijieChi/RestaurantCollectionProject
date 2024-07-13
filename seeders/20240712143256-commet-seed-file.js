'use strict'
const { Restaurant, User } = require('../models')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ attributes: ['id'], raw: true })
    const restaurants = await Restaurant.findAll({ attributes: ['id'], raw: true })
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 50 }, () => ({
        text: faker.lorem.sentence(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
