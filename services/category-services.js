const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, cb) => {
    try {
      const catagories = await Category.findAll({
        raw: true
      })
      return cb(null, { catagories })
    } catch (err) {
      cb(err)
    }
  },
  getCategory: async (req, cb) => {
    try {
      const category = await Category.findByPk(req.params.id, {
        raw: true
      })
      return cb(null, { category })
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = categoryController
