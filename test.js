// 数据库 mongodb（orm: mongoose）
// 框架 koa koa-router
// url /{name}/{api}
// POST: add,update,delete
// GET: list,detail,page

// add 参数：{fields}
// update 参数：id,{fields}
// delete 参数：id
// list 参数：无
// detail 参数：id
// page 参数：page_no,page_size

const easy = require("./few");
easy.setConfig({
  mongo: "mongodb://localhost/test", // 默认数据库
  response: {
    // 返回格式
    errno: "errno",
    errmsg: "errmsg",
    data: "data",
  },
  entities: [
    {
      name: "member",
      api: "add,update,delete,list,detail,page",
      fields: {
        created_at: { type: Date },
        updated_at: { type: Date },
        name: { type: String, default: "", unique: true },
        gender: { type: String, default: "" },
        birthday: { type: Date, default: null },
        mate: { type: String, default: "" },
        children: [String],
      },
    },
    {
      name: "user",
      api: "add,update,delete,page",
      fields: {
        name: String,
        gender: String,
        birthday: Date,
        mate: String,
        children: [String],
      },
    },
  ],
});

easy.run(3000);
