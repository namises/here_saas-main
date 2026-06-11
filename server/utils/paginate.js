import mongoose from "mongoose";

export const buildFilters = (filters = {}, config = {}) => {
  const query = {};
  for (const [key, value] of Object.entries(filters)) {
    const rule = config[key];

    if (key === "or" && rule?.type === "or" && typeof value === "object") {
      const orConditions = [];

      for (const orKey of rule.keys) {
        const orValue = value[orKey];
        if (orValue === undefined || orValue === null || orValue === "") continue;

        const subRule = config[orKey];
        if (subRule?.type === "string" && subRule.mode === "partial") {
          orConditions.push({
            [orKey]: { $regex: orValue, $options: "i" },
          });
        } else {
          orConditions.push({
            [orKey]: orValue,
          });
        }
      }

      if (orConditions.length) {
        query["$or"] = orConditions;
      }
      continue;
    }

    if (!rule) {
      query[key] = value;
      continue;
    }

    if (value === undefined || value === null || value === "") continue;

    switch (rule.type) {
      case "string":
        if (rule.mode === "partial") {
          query[key] = { $regex: value, $options: "i" };
        } else {
          query[key] = value;
        }
        break;

      case "objectId":
        if (mongoose.Types.ObjectId.isValid(value)) {
          query[key] = new mongoose.Types.ObjectId(value);
        }
        break;

      case "enum":
        query[key] = value;
        break;

      case "number":
        const range = {};
        if (value.min !== undefined) range.$gte = value.min;
        if (value.max !== undefined) range.$lte = value.max;
        if (value.exact !== undefined) range = value.exact;
        if (Object.keys(range).length) query[key] = range;
        break;

      default:
        query[key] = value;
    }
  }
  return query;
};

export default async function paginate({ page = 1, limit = 10, Model, rawFilter = {}, filterConfig, populate = null, project = null }) {
  try {
    const filter = buildFilters(rawFilter, filterConfig);
    const totalResults = await Model.countDocuments(filter);
    const lastPage = Math.ceil(totalResults / limit);
    const skip = (page - 1) * limit;
    let query = Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (project) {
      query = query.select(project);
    }

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((pop) => {
          query = query.populate(pop);
        });
      } else {
        query = query.populate(populate);
      }
    }
    const items = await query;
    return {
      items,
      pagination: {
        totalResults,
        previousPage: page > 1 ? page - 1 : null,
        currentPage: page,
        nextPage: page < lastPage ? page + 1 : null,
        lastPage,
        limit,
      },
    };
  } catch (error) {
    throw error;
  }
}
