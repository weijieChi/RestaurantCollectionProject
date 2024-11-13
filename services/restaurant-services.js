const { Restaurant, Category, User, Comment, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId, 10) || ''
    const page = Number(req.query.page, 10) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => cb(err))
  },
  getRestaurant: async (req, cb) => {
    try {
      const restaurant = {
        restaurant: await Restaurant.findByPk(req.params.id, {
          include: [
            Category,
            { model: Comment, include: User },
            { model: User, as: 'FavoritedUsers' },
            { model: User, as: 'LikesUsers' }
          ],
          raw: true
        })
      }
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return cb(null, restaurant
      )
    } catch (err) {
      return cb(err)
    }
  },
  getDashboard: async (req, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })
      const commentCount = await Comment.count({
        where: { restaurantId: req.params.id }
      })
      const favoriteCount = await Favorite.count({
        where: { restaurantId: req.params.id }
      })
      return cb(null, { restaurant, commentCount, favoriteCount })
    } catch (err) {
      cb(err)
    }
  },
  getFeeds: async (req, cb) => {
    try {
      const top10Restaurants = await Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      })
      const top10Comments = await Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
      return cb(null, { top10Restaurants, top10Comments })
    } catch (err) {
      cb(err)
    }
  },
  getTopRestaurants: async (req, cb) => {
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
      cb(null, { restaurants })
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = restaurantServices
