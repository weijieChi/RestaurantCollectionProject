# 餐廳收藏網站作品介紹
餐廳收藏網站是一個支援使用者註冊、餐廳收藏及管理功能的專案，提供 SSR(server side rendering) 的前台與後台網頁的完整功能，並支援 RESTful API 供其他應用程式使用。
# 主要功能如下：
* 使用者功能
    * 使用者註冊
    * 使用者登入
    * 使用者登出
    * 區分一般使用者與管理者，管理者可訪問後台功能。
    * 可以追蹤其他使用者
* 餐廳蒐藏功能
    * 使用者可以新增餐廳
    * 將餐廳加入蒐藏
    * 在餐廳詳細資料頁面留言
    * 修改餐廳資料
* 前台主頁
    * 顯示最新新增十筆餐廳
    * 顯示最多人蒐藏前十筆餐廳
* 後台功能(使用者帳號身分需要為管理者身分才能進入後台網頁)
    * 餐廳管理
    * 餐廳分類管理
    * 使用者帳號管理
    * 留言管理 

# 使用技術

* 網站使用的技術
    * **Node.js**
    * **MySQL**
    * **express.js**
    * **sequelize (ORM)**
* 使用者帳號
    * 以 **passport-localStrategy** 作為網頁使用者認證機制， API 以 **passport-JWT** 作為 API 使用這認證
      使用 **JWT** 和 **Session** 同時支援 API 和網頁端認證。
    * 使用者註冊時候以 **bcrypt.js** 雜湊及加鹽使用者密碼，和使用者登入時候的密碼驗證
    * 登入認證使用 email
* 資料庫
    * 使用 **MySQL** 作為 DBMS
    * 以 **sequelize** 作為資料庫操作的 ORM
    * 資料表規劃遵循**第三正規化**，確保資料一致性與操作效率。
    * 以 **sequelize migrate** 作為資料庫 schema 版控工具
    * 採用 **MVC** 架構，將重複的資料邏輯提取到 Service 層，提升程式碼的可維護性。
* view engines 使用 **express-handlebars** 並將部分重複網頁內容抽離城 partials 處理
* API server 部分功能
    * 以 **JSON** 做為資料主要傳遞格式
    * 路由設計遵循 **RESTful API**，確保可擴展性與標準化。
    * 以 **JWT** 作為 API 認證 token

# 環境需求與安裝指引

## Environment Requirement 環境需求
* 需要安裝 node.js engine 以及 npm 套件管理工具
* 需要安中 git 版控工具
* 需要安裝 MySQL server

### 快速檢查清單
- [ ] Node.js 已安裝
- [ ] npm 已安裝
- [ ] MySQL 已安裝且正在運行
- [ ] git 已安裝

## Execution 執行方式
**Windows 執行環境注意事項⚠**
    node.js windows 版本其專案所在路徑不可以有空白字元 ex: `C:\alpha camp\my folder` 跟含有非英文非 ASCII 字元 ex: `C:\Users\吳柏毅\dev`

**步驟 Step**
1. 在 MySQL 建立資料庫
以下為建立資料庫的建議 SQL 語法
```sql
-- 建立資料庫
CREATE DATABASE `forum`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

2. 先用 git clone 從 github repositories 複製檔案，使用 ssh 協定。
```
git clone git@github.com:weijieChi/RestaurantCollectionProject.git
```
3. 進入專案所在目錄
```
cd ./RestaurantCollectionProject
```
4. 使用 npm 安裝執行所需的套件。
```
npm install
```
5. 資料庫連線設定
在 `/config/config.json` 這個 sequelize 設定檔中可依據自身環境需求調整設定內容
因為專案展示只會使用到 development 環境，所以只展示 development 環境設定

```json
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "forum",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
}
```
* username: 操作資料庫的管理帳號
* password: 登入資料庫管理帳號的密碼
* database: 所要連結的資料庫名稱
* host: 資料庫的 IP
6. 使用 sequelize-cli 建立 database schema
```
npx sequelize db:migrate
```
7. 使用 sequelize-cli 建立初始資料(建立測試資料)
```sh
npx sequelize db:seed:all
```
8. 將環境變數 **NODE_ENV** 設為 `development` 否則程式執行將會出現錯誤
各個作業系統環境變數的設定方式可以[參考這邊](#各別作業系統環境變數設定方式)

9. 在專案跟目錄 `/` 目錄建立 `.env` 檔案，其環境變數要依據您的環境需求自行設定，可在 `.env.example` 找到參考內容

```txt
JWT_SECRET=forJWTSecretString
SESSION_SECRET=forSessionSecretString
```

10. 透過 npm 執行伺服器程式。
```sh
npm run start
```
11. 網頁在瀏覽器網址列輸入 `http://localhost:3000/` 就可以打開網頁了
API 請參閱這份 [API 說明文件](./APIdocument.md)

1. 最後要關閉伺服器就在 terminal 案 `ctrl` + `C` 再按 `y` + `enter` 關閉 nodejs 伺服器。

# 其他補充

## 各別作業系統環境變數設定方式

### windows
windows 開發環境使用者強烈建議使用 powershell ，因為 powershell 是現在微軟推薦並且有在維護的命令列環境工具，且 windows visual studio code 預設命令列工具就是 powershell
**Powershell 設定方式**

```ps1
# 顯示環境變數方式，前面的 env 可以是任意大小寫
$env:HomePath

# 設定環境變數方式
$Env:NODE_ENV="development"  # 字串要用單引號或是雙引號包住，不然系統會認為是函式或是類別

# 移除環境變數方式 powershell 沒有刪除環境變數的指令，而是透過因 windows 不允許環境變視為空字串或是空值，所以只要將已經存在的環境變數設回空字串，系統就會將該環境變數移除
$env:NODE_ENV=""
```

**命令提示字元 cmd.exe 設定方式**
不建議使用 命令提示字元 來執行專案

```cmd
:: 顯示環境變數方式
echo %HomePath%

:: 設定環境變數方式
set NODE_ENV=development

:: 移除環境變數方式，一樣將環境變數設為空值即可，等號右邊沒有任何字元
set NODE_ENV=
```

### UNIX Like (Linux, Mac OSX, FreeBSD 等)

基本上 UNIX Like 作業系統 CLI 設定環境變數的方法大同小異

```sh
# 顯示環境變數，有兩種方式，範例分別如下
# 1
printenv HOME
# 2
echo $HOME

# 設定環境變數
export NODE_ENV=development

# 刪除環境變數
unset NODE_ENV
```