const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  // 新增以下 教範的寫法，是另外修改 express-handlebars 內建的 if 函式
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  // 另外一種方式，可以在 helper 內用 (functionName, vale1, value2, ...) 使用
  isEqual: (value1, value2) => value1 === value2
}
