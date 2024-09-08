# DevC4後端專修 M6 餐廳論壇:專案開發實戰 (3) 進階關聯 指標作業 TOP 10 人氣餐廳 (R05)

1. 問題出處：
DevC4後端專修 M6 餐廳論壇:專案開發實戰 (3) 進階關聯 指標作業 TOP 10 人氣餐廳 (R05)

2. 問題需求：
在實作餐廳收藏排名的時候想不出來要如何使用 **sequelize** 語法實現在資料庫依據收藏數排名並取出收藏前十大清單
我知道可以先取出所有清單後在 node.js 伺服器端處理，但是我想要嘗試以 sequelize 語法實現在 SQL 伺服器端處理方法，以降低 node.js 伺服器負擔

期待結果
```js
[
  {
    id: 150,
    name: 'Laurence Farrell',
    tel: '1-299-326-1759',
    address: '5138 Kimberly Avenue',
    openingHours: '08:00',
    description: 'Assumenda quo id eos.',
    image: 'https://loremflickr.com/320/240/restaurant,food/?random=67.38401958802369',
    viewCount: 0,
    createdAt: 2024-07-12T15:09:48.000Z,
    updatedAt: 2024-07-12T15:09:48.000Z,
    CategoryId: 13,
    categoryId: 13,
    favoriteCounts: 5 // 後面要加上收藏比數
  },
  // ... 共十筆前十大蒐藏清單
]
```

3. 嘗試：
在 [【後端隨筆】關聯式資料庫＿Sequelize＿查詢語法篇](https://medium.com/@martin87713/%E5%BE%8C%E7%AB%AF%E9%9A%A8%E7%AD%86-%E9%97%9C%E8%81%AF%E5%BC%8F%E8%B3%87%E6%96%99%E5%BA%AB-sequelize-%E6%9F%A5%E8%A9%A2%E8%AA%9E%E6%B3%95%E7%AF%87-fc3592702300) 有找到參考範例，嘗試改為自己專案模型，但是一直無法正確執行
*tips*
        可以直接在專案根目錄建立 `/forTest.js` 檔案輸入以下內容
```js
const { Restaurant, Sequelize, User } = require('./models')

async function getTopRestaurants () {
  try {
    const topRestaurants = await Restaurant.findAll({
      raw: true,
      mest: true,
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('Favorite.userId')), 'FavoritedCounts']
        ]
      },
      include: [{ model: User, as: 'FavoritedUsers', duplicating: false }],
      group: ['Restaurant.id'],
      order: [
        [Sequelize.fn('COUNT', Sequelize.col('Favorite.userId')), 'DESC']
      ],
      limit: 10
    })

    console.log('Top 10 Restaurants:')
    console.log(topRestaurants)
  } catch (error) {
    console.error('Error fetching top restaurants:', error)
  }
}

getTopRestaurants()

```
然後在跟目錄開啟終端機介面輸入
```
node ./forTest.js
```
就可以直接從 console 看到單一功能執行結果，不必再用 `npm run dev` 執行整個專案

4. 原始碼檔案

[Github](https://github.com/weijieChi/forum-express-grading-github-actions/commit/084b9a65bb5ce498f6dbf3a30a937bca7c69f304)