const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.json(data))
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => err ? next(err) : res.json(data))
  },
  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) => err ? next(err) : res.json(data)
    )
  },
  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  },
  postRestaurants: (req, res, next) => {
    restaurantServices.postRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  },
  putRestaurant: (req, res, next) => {
    restaurantServices.putRestaurant(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = restaurantController
