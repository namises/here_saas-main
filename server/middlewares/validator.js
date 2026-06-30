import { handleError } from "../utils/handlers.js";
export const toValidateOptions = { body: "body", query: "query" };

export const validationOptions = {
  abortEarly: true,
  allowUnknown: false,
  stripUnknown: true,
};
export const validate = (validation) => {
  const { schema, toValidate } = validation;
  const isBody = toValidate === toValidateOptions.body;
  return (req, res, next) => {
    if (schema === null) {
      return next();
    } else if (!schema) {
      throw new Error(`Schema not found for path: ${path}`);
    }
    const { error, value } = schema.validate(isBody ? req.body : req.query, validationOptions);
    if (error) {
      const joiError = {
        success: false,
        // Surface the first detail as a top-level message so the client shows the real reason
        // (the client reads `data.message`) instead of a generic "server error".
        message: error.details?.[0]?.message?.replace(/['"]/g, "") || "Invalid request. Please review and try again.",
        error: {
          details: error.details.map(({ message, type }) => ({
            message: message.replace(/['"]/g, ""),
            type,
          })),
        },
      };
      if (process.env.NODE_ENV === "production") {
        return handleError(res, error, "Invalid request. Please review request and try again.");
      } else {
        return res.send(joiError);
      }
    }

    if (isBody) {
      req.body = value;
    } else {
      req.queryParams = value;
    }
    return next();
  };
};
