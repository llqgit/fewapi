const Koa = require("koa");
const bodyparser = require("koa-bodyparser");
const app = new Koa();
app.use(bodyparser()); // 使用 body parser 才能读取 ctx.request.body 的 post 参数

const mongoose = require("mongoose");

const few = {
  fewConfig: {
    mongo: "mongodb://localhost/test", // 默认数据库
    response: {
      // 返回格式
      errno: "errno",
      errmsg: "errmsg",
      data: "data",
    },
  },
  fewEntities: [], // 实体配置
  dbEntities: {}, // 数据库连接实体

  // 设置 config
  setConfig(config) {
    this.fewConfig = { ...this.fewConfig, ...config }; // 覆盖
    this.setEntities(this.fewConfig.entities);
  },
  // 设置 entity
  setEntities(entities) {
    this.fewEntities = entities;
  },
  // 注册数据库实体
  registerEntity(entity) {
    let name = entity.name;
    this.dbEntities[name] = mongoose.model(name, new mongoose.Schema(entity.fields, { versionKey: false }), name);
  },
  // 生成 api
  genAPI() {
    for (let i in this.fewEntities) {
      let entity = this.fewEntities[i];
      let apiList = entity.api.split(/\s*,\s*/).filter(s => s);

      this.registerEntity(entity); // 注册数据库实体

      for (let j in apiList) {
        let api = apiList[j];
        let method = "GET";
        let params = {};

        switch (api) {
          case "add":
            method = "POST";
            params = entity.fields;
            break;
          case "update":
            method = "POST";
            params = { id: String, ...entity.fields };
            break;
          case "delete":
            method = "POST";
            params = { id: String };
            break;
          case "detail":
            method = "GET";
            params = { id: String };
            break;
          case "list":
            method = "GET";
            break;
          case "page":
            method = "GET";
            params = { page_no: Number, page_size: Number };
            break;

          default:
            break;
        }

        this.useAPI(api, method, params, entity);
      }
    }
  },
  // 应用API
  useAPI(api, method, params, entity) {
    let path = `/${entity.name}/${api}`;
    console.log("route path:", method, path);
    app.use(async (ctx, next) => {
      console.log("request path:", ctx.method, ctx.path, method, path);
      if (ctx.path === path && ctx.method === method) {
        // 区分 get 和 post 参数来源 method
        let query = ctx.query;
        if (ctx.method == "POST") {
          query = ctx.request.body;
        }

        // 参数赋值
        for (let i in params) {
          params[i] = query[i];
        }

        let model = this.dbEntities[entity.name];
        let result = "OK";

        try {
          switch (api) {
            case "add":
              this.success(ctx, await new model(params).save());
              break;
            case "update":
              params.updated_at && (params.updated_at = Date.now());
              this.success(ctx, await model.findOneAndUpdate({ _id: params.id }, params));
              break;
            case "delete":
              this.success(ctx, await model.findOneAndRemove({ _id: params.id }));
              break;
            case "detail":
              this.success(ctx, await model.findOneAndRemove({ _id: params.id }));
              break;
            case "list":
              this.success(ctx, await model.find());
              break;
            case "page":
              this.success(
                ctx,
                await model
                  .find()
                  .skip((params.page_no - 1) * params.page_size)
                  .limit(params.page_size)
              );
              break;
            default:
              this.success(result);
              break;
          }
        } catch (e) {
          this.fail(ctx, e.code, e.errmsg);
        }
      } else {
        await next();
      }
    });
  },
  // 返回成功格式
  success(ctx, data) {
    ctx.body = {
      [this.fewConfig.response["errno"]]: 0,
      [this.fewConfig.response["errmsg"]]: "",
      [this.fewConfig.response["data"]]: data,
    };
  },
  // 返回分页格式
  page(ctx, page_no, page_size, total, list) {
    ctx.body = {
      [this.fewConfig.response["errno"]]: 0,
      [this.fewConfig.response["errmsg"]]: "",
      [this.fewConfig.response["data"]]: {
        [this.fewConfig.response["page_no"]]: page_no,
        [this.fewConfig.response["page_size"]]: page_size,
        [this.fewConfig.response["total"]]: total,
        [this.fewConfig.response["list"]]: list,
      },
    };
  },
  // 返回失败格式
  fail(ctx, errno, errmsg) {
    ctx.body = { [this.fewConfig.response["errno"]]: errno, [this.fewConfig.response["errmsg"]]: errmsg };
  },
  // 运行应用
  run(port) {
    mongoose.connect(this.fewConfig.mongo, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("--- run ---\nport: ", port);
    this.genAPI();
    app.listen(port);
  },
};

module.exports = few;
