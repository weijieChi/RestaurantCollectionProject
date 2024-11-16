const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')
const upload = require('../../../middleware/multer')

// restaurants
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// category
router.get('/categories/:id', categoryController.getCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

module.exports = router
