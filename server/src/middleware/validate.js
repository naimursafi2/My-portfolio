import { badRequest } from "../utils/ApiError.js";

/** Validates req[source] against a zod schema and replaces it with the parsed value. */
export const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || source,
      message: issue.message,
    }));
    return next(badRequest("Validation failed", details));
  }
  req[source] = result.data;
  next();
};
