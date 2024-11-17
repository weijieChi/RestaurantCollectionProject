const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const commentController = require('../../controllers/apis/comment-controller')

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')

// admin
router.use('/admin', authenticated, authenticatedAdmin, admin)

// restaurants
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.post('/restaurants', upload.single('image'), restController.postRestaurants)
router.put('/restaurants/:id', authenticated, restController.putRestaurant)
router.delete('/restaurants/:id', authenticated, restController.deleteRestaurant)

// comment
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticated, commentController.deleteComment)

// user sign-in sing-up
router.post('/sign-in', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/sign-up', userController.signUp)
router.use('/', apiErrorHandler)

module.exports = router
