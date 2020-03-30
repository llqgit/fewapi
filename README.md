# fewAPI

基于 `NodeJS` 和 `MongoDB` | Base on `NodeJS` and `MongoDB`

## 1.目标 - Target
> - Use a few code to build a api server base on mongodb databases;
> - 用最少的代码，构建一个基于 mongodb 数据库的 API 服务；

- I have use the version below.
And lower version you need have a try to test whether right or not.
- 我（作者）使用下面的版本进行的代码编写，更低的版本，需要你自己试一下。

> - nodejs 12
> - mongodb 3.4
> - mongoose 5.9.6
> - koa 2

## 2.快速开始 - Quick Start

```js
npm install fewapi
```
or
```js
yarn add fewapi
```

index.js
```js
const few = require("fewapi");

// set your own config
// 设置你的配置
few.setConfig({
  // databases connection
  // 数据库连接
  mongo: "mongodb://localhost/test",
  // API response that you can custom your own resp struct, only include these three key words.
  // 接口返回格式，你可以自定义自己的结构，只能包含这三个字段
  response: {
    errno: "errno",
    errmsg: "errmsg",
    data: "data",
  },
  // entities each one are several api
  // 每个数据库实体可以包含多个 api
  entities: [
    {
      name: "user",
      api: "add,update,delete,list,detail,page",
      // fields is entirely mapping to mongoose schema
      // you can find docs here http://www.mongoosejs.net
      // 所有 fields 字段完全对应 mongoose 的 schema
      // 你可以去这里看文档 http://www.mongoosejs.net
      fields: {
        created_at: { type: Date },
        updated_at: { type: Date },
        name: { type: String, default: "", unique: true },
        gender: { type: String, default: "" },
        birthday: { type: Date, default: null },
        mate: { type: String, default: "" },
        children: [String],
      },
    }
  ]
})

// start a server serve at port 3000
// 启动 server 服务在 3000 端口
few.run(3000);
```

## 3.默认API - Default API

- You can choose generate one or more api in one model like this:
- 你可以选择生成一个或者多个 api，像下面这样：

```js
...
entities: [
    {
      name: "user1",
      api: "add,list", // 这里不一样。difference here.
      fields: {
        name: { type: String, default: ""},
      },
    }, {
      name: "user2",
      api: "add,page,detail",
      fields: {
        name: { type: String, default: ""},
      },
    }, {
      name: "user3",
      api: "update",
      fields: {
        name: { type: String, default: ""},
      },
    }
  ]
...
```

- We well have api like this:
- 我们生成了下面的API：

```js
POST /user1/add
GET  /user1/list
POST /user2/add
GET  /user2/page
GET  /user2/detail
POST /user3/update
```

## 4.API 列表 - API list

- You can find all API that `fewAPI` support here.
- 你能在下面找到所有 `fewAPI` 支持的生成 API。

### add
- method POST
- params { fields }
- note: All params from `ctx.request.body`

eg:
```js
// request:
POST localhost:3000/user/add

// body:
name:hello user 007
gender:男
birthday:2020-03-03
mate:xxx
children:iuü
children:小淘气

// response:
{
    "errno": 0,
    "errmsg": "",
    "data": {
        "name": "hello user 007",
        "gender": "男",
        "birthday": "2020-03-03T00:00:00.000Z",
        "mate": "xxx",
        "children": [
            "iuü",
            "小淘气"
        ],
        "_id": "5e8176c48072d7be0432808a"
    }
}
```

### update
- method POST
- params id, { fields }
- note: All params from `ctx.request.body`

eg:
```js
// request:
POST localhost:3000/user/update

// body:
id:5e8176c48072d7be0432808a
name:hello user 007
gender:男
birthday:2020-03-03
mate:xxx
children:iuü
children:小淘气666

// response:
{
    "errno": 0,
    "errmsg": "",
    "data": {
        "name": "hello user 007",
        "gender": "男",
        "birthday": "2020-03-03T00:00:00.000Z",
        "mate": "xxx",
        "children": [
            "iuü",
            "小淘气666"
        ],
        "_id": "5e8176c48072d7be0432808a"
    }
}
```

### delete
- method POST
- params id
- note: All params from `ctx.request.body`

eg:
```js
// request:
GET localhost:3000/user/delete

// body:
id:5e8176c48072d7be0432808a

// response:
{
    "errno": 0,
    "errmsg": "",
    "data": {
        "name": "hello user 007",
        "gender": "男",
        "birthday": "2020-03-03T00:00:00.000Z",
        "mate": "xxx",
        "children": [
            "iuü",
            "小淘气666"
        ],
        "_id": "5e8176c48072d7be0432808a"
    }
}
```

### list
- method GET
- params 
- note: All params from `ctx.query`

eg:
```js
// request:
GET localhost:3000/user/list

// query:
NONE

// response:
{
    "errno": 0,
    "errmsg": "",
    "data": [
        {
            "name": "test",
            "gender": "",
            "birthday": null,
            "mate": "",
            "children": [],
            "_id": "5e809ce308db6ceea1c1aadd"
        },
        {
            "name": "Im bad ass",
            "gender": "男",
            "birthday": "2020-03-03T00:00:00.000Z",
            "mate": "xxx",
            "children": [
                "foo",
                "bar"
            ],
            "_id": "5e80a63a24ab3bfe9a67a6f3"
        }
    ]
}
```

### detail
- method GET
- params id
- note: All params from `ctx.query`

eg:
```js
// request:
GET localhost:3000/user/detail

// query:
id:5e80a62b24ab3bfe9a67a6f2

// response:
{
    "errno": 0,
    "errmsg": "",
    "data": {
        "name": "hello 008",
        "gender": "男",
        "birthday": "2020-03-03T00:00:00.000Z",
        "mate": "xxx",
        "children": [],
        "_id": "5e80a62b24ab3bfe9a67a6f2"
    }
}
```

### page
- method GET
- params page_no, page_size
- note: All params from `ctx.query`

eg:
```js
// request:
GET localhost:3000/user/page

// query:
page_no:1
page_size:2

// response:
{
    "errno": 0,
    "errmsg": "",
    "data": {
        "page_no": 1,
        "page_size": 2,
        "total": 6,
        "list": [
            {
                "name": "test",
                "gender": "",
                "birthday": null,
                "mate": "",
                "children": [],
                "_id": "5e809ce308db6ceea1c1aadd"
            },
            {
                "name": "test1",
                "gender": "",
                "birthday": null,
                "mate": "",
                "children": [],
                "_id": "5e80a19c4d53edfdfe0bab18"
            }
        ]
    }
}
```


## 最亮那颗星 - The brightest star

- If you like this project, you have a choose to GIVE IT a **star✨** conveniently. THX.
- 如果你喜欢这个项目，你可以选择随手摔给我一颗星星✨

