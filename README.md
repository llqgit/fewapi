# fewAPI

## 1.Target
Use a few code to build a api server base on mongodb databases;

I have use the version below.
And lower version you need have a try to test whether right or not.

- nodejs 12
- mongodb 3.4
- mongoose 5.9.6
- koa 2

## 2.Usage

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

few.setConfig({
  mongo: "mongodb://localhost/test", // databases connection
  // response that you can custom your own resp struct
  response: {
    // 返回格式
    errno: "errno",
    errmsg: "errmsg",
    data: "data",
  },
  // entities each one are seveal api
  entities: [
    {
      name: "member",
      api: "add,update,delete,list,detail,page",
      // fileds is totaly mapping to mongoose schame
      // you can find docs here http://www.mongoosejs.net
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
few.run(3000);
```

## 3.Default API

You can choose one or more api in one model.
Like this:

```js
...
entities: [
    {
      name: "user1",
      api: "add,list",
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

We well have api like this:

```js
POST /user1/add
GET  /user1/list
POST /user2/add
GET  /user2/page
GET  /user2/detail
POST /user3/update
```

### add
- method POST
- params { fields }

### update
- method POST
- params id, { fields }

### delete
- method POST
- params id

### list
- method GET
- params 

### detail
- method GET
- params id

### page
- method GET
- params page_no, page_size
