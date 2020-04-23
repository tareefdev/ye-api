const Router = require("koa-router");
const Joi = require("@hapi/joi");
const observations = require("./observations");
const collections = require("./collections");
const incidents = require("./incident");
const helper = require("../src/helper");

const router = new Router();
const filterObservations = observations.filter;
const listObservations = observations.list;
const getCollection = collections.get;
const getCh = collections.getCh;
const splitData = helper.splitData;
const getIncident = incidents.get;
console.log("hi", incidents);

// Schemas to validate query parameters
const searchSchema = Joi.object({
  collection: Joi.string(),
  lang: Joi.string()
    .allow("ar")
    .allow("en")
    .only()
    .required(),
  title: Joi.string()
    .allow("")
    .optional(),
  location: Joi.string()
    .allow("")
    .optional(),
  dateBefore: Joi.any(),
  dateAfter: Joi.any(),
  page: Joi.number()
    .integer()
    .min(1)
});

const observationsSchema = Joi.object({
  lang: Joi.string(),
  page: Joi.number()
    .integer()
    .min(1)
    .required()
});

const collectionsSchema = Joi.object({
  collection: Joi.string().required(),
  lang: Joi.string().alphanum()
});

router.get("/search", ctx => {
  try {
    const { error } = searchSchema.validate(ctx.request.query);
    if (!error) {
      const results = filterObservations(ctx.request.query);
      ctx.body = splitData(results, ctx.query.page);
    } else {
      ctx.body = { status: 400, msg: error.message };
    }
  } catch (err) {
    ctx.throw(err);
  }
});

router.get("/observations", async ctx => {
  try {
    const { error } = observationsSchema.validate(ctx.query);
    if (!error) {
      const results = listObservations(ctx.query);
      ctx.body = splitData(results, ctx.query.page);
    } else {
      ctx.body = { status: 400, msg: error.message };
    }
  } catch (err) {
    ctx.throw(err);
  }
});

router.get("/collections", async ctx => {
  try {
    const { error } = collectionsSchema.validate(ctx.query);
    if (!error) {
      const results = getCollection(ctx.query);
      ctx.body = { page: 1, pageCount: 1, data: results };
    } else {
      ctx.body = { status: 400, msg: error.message };
    }
  } catch (err) {
    ctx.throw(err);
  }
});

router.get("/incident", async ctx => {
  const results = getIncident(ctx.query);
  ctx.body = { page: 1, pageCount: 1, data: results };
});

router.get("/collections/chemical", async ctx => {
  try {
    const results = getCh(ctx.query);
    ctx.body = { page: 1, pageCount: 1, data: results };
  } catch (err) {
    ctx.throw(err);
  }
});

module.exports = router;
