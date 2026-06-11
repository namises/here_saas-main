import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import paginate from "../../utils/paginate.js";

const filterConfig = {
  organization: { type: "objectId" },
  or: {
    keys: ["name", "code", "description"],
    type: "or",
    mode: "partial",
  },
  name: { type: "string", mode: "partial" },
  code: { type: "string", mode: "partial" },
  description: { type: "string", mode: "partial" },
};

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { page, limit, name, code, description } = req.queryParams;
    const rawFilter = {
      organization,
      or: { name, code, description },
    };

    const departments = await paginate({
      page,
      limit,
      Model: DB.Department,
      rawFilter,
      filterConfig,
      project: "name code description",
    });
    return handleResponse(res, {
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  //
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  name: Joi.string().min(2).max(64).optional(),
  code: Joi.string().alphanum().min(2).max(16).optional(),
  description: Joi.string().max(256).optional(),
});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
