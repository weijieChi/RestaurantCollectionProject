const { Restaurant, User } = require('../../models')
const restaurantServices = require('../../services/restaurant-services') // 引入 restaurant-services
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.render('restaurant', data)
    )
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => err ? next(err) : res.render('dashboard', data))
  },
  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) => err ? next(err) : res.render('feeds', data))
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const allRestaurants = await Restaurant.findAll({
        include: [{
          model: User, as: 'FavoritedUsers'
        }]
      })
      const addFavoritedCountRestaurants = allRestaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description ? r.dataValues.description.substring(0, 50) : '',
        favoritedCount: r.FavoritedUsers.length,
        isFavorited: req.user && req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      const sortRestaurants = addFavoritedCountRestaurants.sort((a, b) => b.favoritedCount - a.favoritedCount)
      const restaurants = sortRestaurants.slice(0, 10) // 因為採用非同步寫法，所以特別修改城府符合測試程式規範的變數命名方式
      res.render('top-restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = restaurantController
