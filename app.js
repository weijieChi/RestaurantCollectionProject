// 環境變數檢查
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config() // dotenv
}

const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars') // 引入 express-handlebars
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { pages, apis } = require('./routes')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET // 可以改為環境變數

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: handlebarsHelpers
}))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req)
  next()
})
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/api', apis)
app.use(pages)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
