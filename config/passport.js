const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

// set up Passport strategy
passport.use(new LocalStrategy(
  // cusetomize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messasges', '帳號或是密碼輸入錯誤'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messasges', '帳號或是密碼輸入錯誤'))
        })
        return cb(null, user)
      })
  }
))
// serialize and deserializer user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    console.log(user)
    return cb(null, user)
  })
})
module.exports = passport