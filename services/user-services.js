const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
  signUp: async (req, cb) => {
    try {
      // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email: req.body.email } })
      // 確認資料裡面沒有一樣的 email ，若有，就建立一個 Error 物件並拋出
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10) // bcrypt 竟然是 promise
      const data = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      const newUser = data.toJSON()
      delete newUser.password
      cb(null, { newUser })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userService
