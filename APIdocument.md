餐廳收藏網站 API 文件
所有 domain 預設為 `http://localhost:3000`

# 目錄
- [目錄](#目錄)
- [通用錯誤訊息格式](#通用錯誤訊息格式)
- [帳號相關 API](#帳號相關-api)
  - [帳號註冊](#帳號註冊)
    - [路由：`/api/sign-up`](#路由apisign-up)
    - [功能：　將使用註冊資料傳送到伺服器進行註冊](#功能將使用註冊資料傳送到伺服器進行註冊)
    - [request:](#request)
    - [response:](#response)
      - [Success:](#success)
      - [Failure](#failure)
  - [帳號登入](#帳號登入)
    - [路由: `/api/sign-in`](#路由-apisign-in)
    - [Method: POST](#method-post)
    - [功能: 帳號登入，並取得 JWT token](#功能-帳號登入並取得-jwt-token)
    - [request:](#request-1)
    - [response:](#response-1)
      - [Success:](#success-1)
      - [Failure](#failure-1)
- [餐廳資料相關](#餐廳資料相關)
  - [取得餐廳資料列表](#取得餐廳資料列表)
    - [路由: /api/admin/restaurants](#路由-apiadminrestaurants)
    - [Method: GET](#method-get)
    - [功能: 取得餐廳列表](#功能-取得餐廳列表)
    - [Query:](#query)
    - [**Query Parameters**](#query-parameters)
    - [URN 範例:](#urn-範例)
    - [Request:](#request-2)
    - [Response:](#response-2)
      - [success:](#success-2)
      - [Failure:](#failure-2)
  - [取得單筆餐廳詳細資料](#取得單筆餐廳詳細資料)
    - [路由: `/api/admin/restaurants/:id`](#路由-apiadminrestaurantsid)
    - [Method: GET](#method-get-1)
    - [功能: 取的單筆餐廳詳細資料](#功能-取的單筆餐廳詳細資料)
    - [Parameters: `/:id`](#parameters-id)
    - [Request:](#request-3)
    - [Response:](#response-3)
      - [success:](#success-3)
      - [Failure:](#failure-3)
  - [新增一家餐廳資料](#新增一家餐廳資料)
    - [HTTP Method: POST](#http-method-post)
    - [路徑： /api/admin/restaurants/](#路徑-apiadminrestaurants)
    - [功能： 新增一筆餐廳資料](#功能-新增一筆餐廳資料)
    - [Request:](#request-4)
      - [http request head](#http-request-head)
    - [Response:](#response-4)
      - [success:](#success-4)
      - [Failure:](#failure-4)
  - [修改餐廳資料](#修改餐廳資料)
    - [HTTP Method: PUT](#http-method-put)
    - [路由： `/api/admin/restaurants/:id`](#路由-apiadminrestaurantsid-1)
    - [功能： 更新單筆餐廳資料](#功能-更新單筆餐廳資料)
    - [Parameters: `/:id`](#parameters-id-1)
    - [Request:](#request-5)
    - [Response:](#response-5)
      - [success:](#success-5)
      - [Failure:](#failure-5)
  - [刪除單筆餐廳詳細資料](#刪除單筆餐廳詳細資料)
    - [Method: DELETE](#method-delete)
    - [路徑： /api/admin/restaurants/:id](#路徑-apiadminrestaurantsid)
    - [中文說明 - 這條 API 是做什麼的： 刪除單筆餐廳資料](#中文說明---這條-api-是做什麼的-刪除單筆餐廳資料)
    - [Parameters: `/:id`](#parameters-id-2)
    - [Request:](#request-6)
    - [Response:](#response-6)
      - [success:](#success-6)
      - [Failure:](#failure-6)

# 通用錯誤訊息格式
當 API 回傳 Failure 錯誤訊息格式接如下:
* http status code: 500
* http response body:
```json
{
  "status": "error",
  "message": "Your error messages"
}
``` 

# 帳號相關 API

## 帳號註冊
### 路由：`/api/sign-up`
### 功能：　將使用註冊資料傳送到伺服器進行註冊
### request:
  * Method: POST
  * body:
  example:
  ```json
  {
    "name": "user5",
    "email": "user5@example.com",
    "password": "12345678",
    "passwordCheck": "12345678"
  }
  ```
  * name: 使用者名稱，數值為 string
  * email: email 信箱，作為帳號登入使用，數值為 string
  * password: 註冊時候使用的密碼，數值為 string
  * passwordCheck: 再次輸入確認密碼，數值為 string
### response: 
   #### Success:
example:
```json
{
    "status": "success",
    "data": {
        "newUser": {
            "id": 34,
            "name": "user5",
            "email": "user5@example.com",
            "updatedAt": "2024-11-27T12:17:19.196Z",
            "createdAt": "2024-11-27T12:17:19.196Z"
         }
      }
}
```
  #### Failure
      1. 密碼確認與註冊密碼不相符
      ```json
      {
        "status": "error",
        "message": "Passwords do not match."
      }
      ```
      2. email 已經註冊
      ```json
      {
        "status": "error",
        "message": "Email already exists!"
      }
      ```
      3. 其他錯誤
        詳細錯誤訊息會顯示在 `message` 內

## 帳號登入
### 路由: `/api/sign-in`
### Method: POST
### 功能: 帳號登入，並取得 JWT token
### request:
    * body:
      example:
      ```json
      {
          "email": "user1@example.com",
          "password": "12345678"
      }
      ```
      email: 使用註冊的 email 信箱，數值為 string
      password: 登入帳號的密碼，數值為 string
### response:
  #### Success:
    ```json
    {
      "status": "success",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsIm5hbWUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAZXhhbXBsZS5jb20iLCJpc0FkbWluIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAyNC0xMS0yNFQxMDo0NTo1Mi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyNC0xMS0yNFQxMDo0NTo1Mi4wMDBaIiwiaWF0IjoxNzMyNzEwNDYyLCJleHAiOjE3MzUzMDI0NjJ9.UhmpVQ5FU8rD6pZw1qv_kfiuWLtn_2kU6a0Jwt3d-_s",
        "user": {
           "id": 32,
           "name": "user1",
           "email": "user1@example.com",
           "isAdmin": false,
           "createdAt": "2024-11-24T10:45:52.000Z",
           "updatedAt": "2024-11-24T10:45:52.000Z"
         }
       }
    }
    ```
    比較重要的是包含在 `data` 內的 `token` ，這是之後 API JWT 認證要使用的 token

  #### Failure
    1. email 錯誤以及密碼錯誤
    ```json
    {
      "status": "error",
      "message": "Incorrect email or password!"
    }
    ```

    2. 其他錯誤
       詳細錯誤訊息會顯示在 `message` 內

# 餐廳資料相關

## 取得餐廳資料列表
### 路由: /api/admin/restaurants
### Method: GET
### 功能: 取得餐廳列表
### Query:
  ### **Query Parameters**
| **名稱** | **型別** | **必需** | **預設值** | **描述**                        |
| -------- | -------- | -------- | ---------- | ------------------------------- |
| category | Integer  | 否       | `null`       | 餐廳分類 ID，查詢特定分類的餐廳 |
| limit    | Integer  | 否       | 6          | 單頁筆數，最大值為 30           |
| page     | Integer  | 否       | 1          | 當前頁碼                        |
  * category:
  數值為整數，為資料表 Categories 的 primary key
  非必要，沒有的時候可以取得所有種類的餐廳資料，有的時候可以取的特定餐廳種類的資料
  如為不存在的 primary key ，或是格式不符合，視為不帶參數
  *分頁參數*
  分頁參數有 `limit` 和 `page` ，數值接為整數，其作用詳述如下:
  * limit: 預設值為 6 ，可接受最大值為 30 ，超過最大值自動設為 30 ，代表一格分頁可顯示的餐廳筆數
  * page: 表示要目前要顯示的頁數
### URN 範例:
  * 未有任何 query RUN: `/restaurants`
  因為沒有任何 query ，所代表地意義為:
  取得所有分類的餐廳清單
  一頁清單的筆數為 6
  分頁為第一頁
  * 有 query URN: `/restaurants?category=5&limit=9&page=3`
  所代表地意義為:
  取的分類 id 為 `5` 的餐廳清單
  分頁顯示 `9` 筆餐廳資料
  分頁為第 `3` 頁
### Request:
  * http request head
    將 JWT Token 放在 HTTP 請求標頭的 Authorization 欄位。
    其格式範例大概如下：
    _http request head_
  ```
  Authorization: Bearer [Your JWT token]
  ```
### Response:
  #### success:
  * http status code: 200
  * http response body:
  
    ```json
    {
        "restaurants": [
            {
                "id": 208,
                "name": "Inez Effertz",
                "tel": "409.624.4025",
                "address": "39428 Bailey Prairie",
                "openingHours": "08:00",
                "description": "Et vero in voluptatem. Veritatis qui hic esse iste",
                "image": "https://loremflickr.com/320/240/restaurant,food/?random=13.69157697244785",
                "viewCount": 0,
                "createdAt": "2024-11-24T10:45:53.000Z",
                "updatedAt": "2024-11-24T10:45:53.000Z",
                "CategoryId": 31,
                "categoryId": 31,
                "Category": {
                    "id": 31,
                    "name": "中式料理",
                    "createdAt": "2024-11-24T10:45:52.000Z",
                    "updatedAt": "2024-11-24T10:45:52.000Z"
                },
                "isFavorited": false,
                "isLiked": false
            },
            { ... } // 其他餐廳資料
        ],
        "categories": [
            {
                "id": 31,
                "name": "中式料理",
                "createdAt": "2024-11-24T10:45:52.000Z",
                "updatedAt": "2024-11-24T10:45:52.000Z"
            },
            {
                "id": 32,
                "name": "日本料理",
                "createdAt": "2024-11-24T10:45:52.000Z",
                "updatedAt": "2024-11-24T10:45:52.000Z"
            },
            {
                "id": 33,
                "name": "義大利料理",
                "createdAt": "2024-11-24T10:45:52.000Z",
                "updatedAt": "2024-11-24T10:45:52.000Z"
            },
            {
                "id": 34,
                "name": "素食料理",
                "createdAt": "2024-11-24T10:45:52.000Z",
                "updatedAt": "2024-11-24T10:45:52.000Z"
            },
            {
                "id": 35,
                "name": "美式料理",
                "createdAt": "2024-11-24T10:45:52.000Z",
                "updatedAt": "2024-11-24T10:45:52.000Z"
            },
            {
                "id": 36,
                "name": "複合式料理",
                "createdAt": "2024-11-24T10:45:52.000Z",
                "updatedAt": "2024-11-24T10:45:52.000Z"
            }
        ],
        "categoryId": "",
        "pagination": {
            "pages": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
            ],
            "totalPage": 9,
            "currentPage": 1,
            "prev": 1,
            "next": 1
        }
    }
    ```
    期各個資料詳述如下:
    * restaurants: 餐廳資料，數值為物件陣列
    * categories: 分類資料，數值為物件陣列
    * categoryId: 為目前查詢所用的分類，數值為整數
    * pagination: 分頁資料
  ####  Failure:
  1. request header 沒有 JWT token 或是 JWT token 未通過認證
    ```json
    {
      "status": "error",
      "message": "unauthorized"
    }
    ```

## 取得單筆餐廳詳細資料
### 路由: `/api/admin/restaurants/:id`
### Method: GET
### 功能: 取的單筆餐廳詳細資料
### Parameters: `/:id`
  必要， `/:id ` 為整數，為餐廳資料的 id
### Request:
  - http request head
    將 JWT Token 放在 HTTP 請求標頭的 Authorization 欄位。
    其格式範例大概如下：
    _http request head_
  ```
  Authorization: Bearer [Your JWT token]
  ```
### Response:
  #### success:
  * http response body:
    ```json
    {
      "status": "success",
      "data": {
        "restaurant": {
          "id": 101,
          "name": "Larry Braun",
          "tel": "(918) 439-0293 x65812",
          "address": "82439 Arthur Place",
          "openingHours": "08:00",
          "description": "non voluptatibus voluptatum",
          "image": "https://loremflickr.com/320/240/restaurant,    food/?random=58.395672127388785",
          "viewCount": 38,
          "createdAt": "2024-07-12T15:09:48.000Z",
          "updatedAt": "2024-09-08T04:50:08.000Z",
          "CategoryId": 15
        }
      }
    }
    ```
  #### Failure:
  * http status code: 500
  * http response body:
  1.  request header 沒有 JWT token 或是 JWT token 未通過認證
    ```json
    {
      "status": "error",
      "message": "unauthorized"
    }
    ```
  2. 沒有該筆餐廳資料:
    ```json
    {
      "status": "error",
      "message": "Restaurant didn't exist!"
    }
    ```
  3. 其他錯誤
     詳細錯誤訊息會顯示在 `message` 內

## 新增一家餐廳資料
### HTTP Method: POST
### 路徑： /api/admin/restaurants/
### 功能： 新增一筆餐廳資料
### Request:
  #### http request head
  將 JWT Token 放在 HTTP 請求標頭的 Authorization 欄位。
  其格式範例大概如下：
  _http request head_
  ```
  Authorization: Bearer [Your JWT token]
  ```
  - request body:
  ```json
  {
    "name": "Larry Braun",
    "tel": "(918) 439-0293 x65812",
    "address": "82439 Arthur Place",
    "openingHours": "08:00",
    "description": "non voluptatibus voluptatum",
    "image": "https://loremflickr.com/320/240/restaurant,    food/?random=58.395672127388785",
    "viewCount": 38,
    "createdAt": "2024-07-12T15:09:48.000Z",
    "updatedAt": "2024-09-08T04:50:08.000Z",
    "CategoryId": 15
  }
  ```
### Response:
  #### success:
  * http status code: 200
  * http response body:

    ```json
    {
      "status": "success",
      "data": {
        "newRestaurant": {
          "id": 101,
          "name": "Larry Braun",
          "tel": "(918) 439-0293 x65812",
          "address": "82439 Arthur Place",
          "openingHours": "08:00",
          "description": "non voluptatibus voluptatum",
          "image": "https://loremflickr.com/320/240/restaurant,    food/?random=58.395672127388785",
          "viewCount": 38,
          "createdAt": "2024-07-12T15:09:48.000Z",
          "updatedAt": "2024-09-08T04:50:08.000Z",
          "CategoryId": 15
        }
      }
    }
    ```
  #### Failure:
    http status code: 500
    1. 其他錯誤:
    詳細錯誤訊息會顯示在 `message` 內

## 修改餐廳資料
### HTTP Method: PUT
### 路由： `/api/admin/restaurants/:id`
### 功能： 更新單筆餐廳資料
### Parameters: `/:id`
  必要，其數值為整數，為該筆餐廳的資料 id
### Request:
  * http request head
    將 JWT Token 放在 HTTP 請求標頭的 Authorization 欄位。
    其格式範例大概如下：
    _http request head_
  ```
  Authorization: Bearer [Your JWT token]
  ```
  * request body:
  ```json
  {
    "name": "Larry Braun",
    "tel": "(918) 439-0293 x65812",
    "address": "82439 Arthur Place",
    "openingHours": "08:00",
    "description": "non voluptatibus voluptatum",
    "image": "https://loremflickr.com/320/240/restaurant,    food/?random=58.395672127388785",
    "viewCount": 38,
    "createdAt": "2024-07-12T15:09:48.000Z",
    "updatedAt": "2024-09-08T04:50:08.000Z",
    "CategoryId": 15
  }
  ```
### Response:
  #### success:
  * http status code: 200
  * http response body:
    ```json
    {
      "status": "success",
      "data": {
        "updateRestaurant": {
          "id": 101,
          "name": "Larry Braun",
          "tel": "(918) 439-0293 x65812",
          "address": "82439 Arthur Place",
          "openingHours": "08:00",
          "description": "non voluptatibus voluptatum",
          "image": "https://loremflickr.com/320/240/restaurant,    food/?random=58.395672127388785",
          "viewCount": 38,
          "createdAt": "2024-07-12T15:09:48.000Z",
          "updatedAt": "2024-09-08T04:50:08.000Z",
          "CategoryId": 15
        }
      }
    }
    ```
#### Failure:
http status code: 500
1. 其他錯誤:
詳細錯誤訊息會顯示在 `message` 內

## 刪除單筆餐廳詳細資料
### Method: DELETE
### 路徑： /api/admin/restaurants/:id
### 中文說明 - 這條 API 是做什麼的： 刪除單筆餐廳資料
### Parameters: `/:id`
  其數值為整數
### Request:
  * http request head
    將 JWT Token 放在 HTTP 請求標頭的 Authorization 欄位。
    其格式範例大概如下：
    _http request head_
  ```
  Authorization: Bearer [Your JWT token]
  ```
### Response:
  #### success:
  * http status code: 200
  * http response body:
    ```json
    {
      "status": "success",
      "data": {
        "deleteRestaurant": {
          "id": 101,
          "name": "Larry Braun",
          "tel": "(918) 439-0293 x65812",
          "address": "82439 Arthur Place",
          "openingHours": "08:00",
          "description": "non voluptatibus voluptatum",
          "image": "https://loremflickr.com/320/240/restaurant,    food/?random=58.395672127388785",
          "viewCount": 38,
          "createdAt": "2024-07-12T15:09:48.000Z",
          "updatedAt": "2024-09-08T04:50:08.000Z",
          "CategoryId": 15
        }
      }
    }
    ```
  #### Failure:
  * http status code: 500
    1. 找不到該餐廳資料
    ```json
    {
      "status": "error",
      "message": "Restaurant didn't exist!"
    }
    ```
    2. 其他錯誤:
    詳細錯誤訊息會顯示在 `message` 內