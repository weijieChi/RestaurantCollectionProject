const { Restaurant, Category, User, Comment, Favorite, sequelize } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { localFileHandler } = require('../helpers/file-helpers')
const restaurantServices = {
  getRestaurants: async (req, cb) => {
    const DEFAULT_LIMIT = 6
    const categoryId = Number(req.query.categoryId, 10) || ''
    const page = Number(req.query.page, 10) || 1
    let limit = Number(req.query.limit) || DEFAULT_LIMIT
    if (limit > 30) { limit = 30 }
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
          description: r.description ? r.description.substring(0, 50) : '',
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
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikesUsers' }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikesUsers.some(L => L.id === req.user.id)
      restaurant.increment('viewCount')
      return cb(null, { restaurant: restaurant.toJSON(), isFavorited: isFavorited, isLiked: isLiked })
    } catch (err) {
      return cb(err)
    }
  },
  postRestaurant: async (req, cb) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const filePath = await localFileHandler(file)
      const newRestaurant = await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })
      cb(null, { restaurant: newRestaurant })
    } catch (err) {
      cb(err)
    }
  },
  putRestaurant: async (req, cb) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const { file } = req
      const filePath = await localFileHandler(file)
      const putRestaurant = await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })
      cb(null, { restaurant: putRestaurant })
    } catch (err) {
      cb(err)
    }
  },
  deleteRestaurant: async (req, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) {
        const err = new Error("Restaurant didn't exist!")
        err.status = 404
        throw err
      }
      const deletedRestaurant = await restaurant.destroy()
      cb(null, { deletedRestaurant })
    } catch (err) {
      cb(err)
    }
  },
  getDashboard: async (req, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })
      const restaurantCommentCount = await Comment.count({
        where: { restaurantId: req.params.id }
      })
      const restaurantFavoriteCount = await Favorite.count({
        where: { restaurantId: req.params.id }
      })
      return cb(null, { restaurant, restaurantCommentCount, restaurantFavoriteCount })
    } catch (err) {
      cb(err)
    }
  },
  getFeeds: async (req, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      })
      const comments = await Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
      return cb(null, { restaurants, comments })
    } catch (err) {
      cb(err)
    }
  },
  getTopRestaurants: async (req, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        attributes: {
          include: [
            [
              sequelize.fn('COUNT', sequelize.col('Favorites.restaurant_id')),
              'favoritedCount'
            ]
          ]
        },
        include: [
          {
            model: Favorite,
            attributes: []
          }
        ],
        group: ['Restaurant.id'],
        order: [[sequelize.col('favoritedCount'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true,
        subQuery: false
      })
      cb(null, { restaurants })
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = restaurantServices
