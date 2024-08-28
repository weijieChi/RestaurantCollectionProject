const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like } = require('../models')
// const { imgurFileHandler } = require('../helpers/file-helpers')
const sequelize = require('sequelize')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email ，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash => {
        User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const userId = Number(req.params.id, 10)
      // npm run test 會出錯的程式碼，應該是測試程式是處於未登入狀態
      // if (userId !== req.user.id) {
      //   req.flash('error_messages', '登入帳號非該使用者帳號！')
      //   return res.redirect('/restaurants')
      // }
      const user = await User.findByPk(userId, { raw: true })
      const userCommentRestaurants = await Comment.findAll({
        attributes: [sequelize.fn('DISTINCT', sequelize.col('restaurant_id'))], // 使用 restaurantId 作為外鍵，並設定不重複
        include: {
          model: Restaurant,
          attributes: ['image', 'name'] // 需要的欄位
        },
        where: { userId },
        raw: true,
        nest: true
      })
      res.render('users/profile', { user, userCommentRestaurants })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error("User Profile did'n exists!")
      res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const id = req.params.id
      if (Number(id, 10) !== req.user.id) throw new Error('登入帳號非該使用者資料帳號')
      const user = await User.findByPk(req.params.id)
      const { name } = req.body
      await user.update({ name })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (error) {
      next(error)
    }
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const restaurant = await Restaurant.findByPk(restaurantId)
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You already like this restaurant!')
      await Like.create({
        userId: req.user.id,
        restaurantId
      })
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const restaurantId = req.params.restaurantId
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!like) throw new Error("You haven't like this restaurant")
      await like.destroy()
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        users = users.map(user => ({
          // 整理格式
          ...user.toJSON(),
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        res.render('top-users', { users: users })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
