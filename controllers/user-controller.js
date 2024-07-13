const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
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
    req.flash('success_nessages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const userId = Number(req.params.id, 10)
      if (userId !== req.user.id) {
        req.flash('error_messages', '登入帳號非該使用者帳號！')
        return res.redirect('/restaurants')
      }
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
  }
}
module.exports = userController
