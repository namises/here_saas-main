import Joi from "joi";
import { handleError, handleResponse } from "./handlers.js";
import { toValidateOptions } from "../middlewares/validator.js";
import paginate from "./paginate.js";
import { objectIdValidator, sanitizeObject } from "./index.js";

/**
 * Factory that produces standard org-scoped CRUD controllers
 * compatible with the { handler, validation } convention used across the app.
 *
 * @param {object} cfg
 * @param {import("mongoose").Model} cfg.Model        Mongoose model (must have `organization`)
 * @param {string} cfg.key                            response key for list payload, e.g. "assets"
 * @param {string} cfg.label                          human label for messages, e.g. "Asset"
 * @param {Joi.ObjectSchema} cfg.createSchema
 * @param {Joi.ObjectSchema} cfg.updateSchema         (must include `id`)
 * @param {Joi.ObjectSchema} [cfg.listSchema]
 * @param {object} [cfg.filterConfig]                 paginate filterConfig
 * @param {string|object|array} [cfg.populate]
 * @param {string} [cfg.project]
 * @param {(query, req) => object} [cfg.buildListFilter]
 * @param {(payload, req) => object|Promise} [cfg.beforeCreate]
 */
export function makeCrud(cfg) {
  const { Model, key, label, createSchema, updateSchema, listSchema, filterConfig = {}, populate = null, project = null, buildListFilter, beforeCreate } = cfg;

  // Auto-declare filter keys so they survive Joi stripUnknown and reach req.queryParams.
  const filterKeys = Object.fromEntries(Object.keys(filterConfig).map((k) => [k, Joi.string().allow("").optional()]));
  const autoListSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(200).default(50),
    ...filterKeys,
  });

  const list = {
    validation: {
      schema: listSchema || autoListSchema,
      toValidate: toValidateOptions.query,
    },
    handler: async (req, res) => {
      try {
        const { organization } = req.user;
        const { page = 1, limit = 50, ...rest } = req.queryParams;
        const extra = buildListFilter ? buildListFilter(rest, req) : rest;
        const rawFilter = { organization, ...extra };
        const data = await paginate({
          page,
          limit,
          Model,
          rawFilter,
          filterConfig: { organization: { type: "objectId" }, ...filterConfig },
          populate,
          project,
        });
        return handleResponse(res, { message: `${label} list fetched successfully`, [key]: data });
      } catch (error) {
        return handleError(res, error, error?.message);
      }
    },
  };

  const create = {
    validation: { schema: createSchema, toValidate: toValidateOptions.body },
    handler: async (req, res) => {
      try {
        const { organization } = req.user;
        let payload = { ...req.body, organization };
        if (beforeCreate) payload = await beforeCreate(payload, req);
        const item = await Model.create(payload);
        return handleResponse(res, { message: `${label} created successfully`, item });
      } catch (error) {
        return handleError(res, error, error?.message);
      }
    },
  };

  const update = {
    validation: { schema: updateSchema, toValidate: toValidateOptions.body },
    handler: async (req, res) => {
      try {
        const { organization } = req.user;
        const { id, ...rest } = req.body;
        const exists = await Model.findOne({ _id: id, organization });
        if (!exists) throw new Error(`${label} not found`);
        const item = await Model.findByIdAndUpdate(id, sanitizeObject(rest), { new: true });
        return handleResponse(res, { message: `${label} updated successfully`, item });
      } catch (error) {
        return handleError(res, error, error?.message);
      }
    },
  };

  const remove = {
    validation: { schema: Joi.object({ id: objectIdValidator.required() }), toValidate: toValidateOptions.body },
    handler: async (req, res) => {
      try {
        const { organization } = req.user;
        const { id } = req.body;
        const exists = await Model.findOne({ _id: id, organization });
        if (!exists) throw new Error(`${label} not found`);
        await Model.findByIdAndDelete(id);
        return handleResponse(res, { message: `${label} deleted successfully` });
      } catch (error) {
        return handleError(res, error, error?.message);
      }
    },
  };

  return { list, create, update, remove };
}

/** Builds an Express router exposing /list /create /update /delete for a crud bundle. */
export function makeCrudRouter(express, validate, crud, extra) {
  const router = express.Router();
  router.get("/list", validate(crud.list.validation), crud.list.handler);
  router.post("/create", validate(crud.create.validation), crud.create.handler);
  router.post("/update", validate(crud.update.validation), crud.update.handler);
  router.post("/delete", validate(crud.remove.validation), crud.remove.handler);
  if (typeof extra === "function") extra(router);
  return router;
}
