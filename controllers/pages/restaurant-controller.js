const { Restaurant, Category, Comment, User, Favorite } = require('../../models')
const restaurantServices = require('../../services/restaurant-services') // 引入 restaurant-services
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikesUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCount') // ?
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikesUsers.some(L => L.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })
      const restaurantCommentCount = await await Comment.count({
        where: { restaurantId: req.params.id }
      })
      const restaurantFavoriteCount = await Favorite.count({
        where: { restaurantId: req.params.id }
      })
      return res.render('dashboard', { restaurant, restaurantCommentCount, restaurantFavoriteCount })
    } catch (error) {
      next(error)
    }
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
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
        description: r.dataValues.description.substring(0, 50),
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
