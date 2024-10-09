const passport = require('../config/passport')
// const authenticated = passport.authenticate('jwt', { session: false }) // 不採用此寫法，因為只會回傳 'Unauthorized' 字串非 json 物件，不利前端處理
const authenticated = (req, res, next) => {
  // passport 執行完畢後會回傳一個 function ，最後面的 )(req, res, next) 其實是執行 passport 回傳的 function 要傳入的參數
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'unauthorized'
      })
    }
    next()
  })(req, res, next)
}
// 將以上寫法以更精確部省略的寫法會如下
// const authenticated = (req, res, next) => {
//   // passport 執行完畢後會回傳一個 function
//   const middleware = passport.authenticate('jwt', { session: false }, (err, user) => {
//     if (err || !user) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'unauthorized'
//       })
//     }
//     next()
//   })
//   middleware(req, res, next)
// }
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
