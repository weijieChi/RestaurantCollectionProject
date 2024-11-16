const { Category } = require('../models')
const categoryServices = {
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
  },
  postCategory: async (req, cb) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findAll({
        where: { name },
        raw: true
      })
      if (category.length) throw new Error('Category already exists!')
      const newCategory = await Category.create({ name })
      return cb(null, { newCategory })
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = categoryServices
