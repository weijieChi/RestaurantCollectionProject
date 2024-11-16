const categoryServices = require('../../services/category-services')
const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, data) => err ? next(err) : res.json(data))
  },
  getCategory: (req, res, next) => {
    categoryServices.getCategory(req, (err, data) => err ? next(err) : res.json(data))
  },
  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = categoryController
