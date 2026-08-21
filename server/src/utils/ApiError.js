export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new ApiError(400, message, details);
export const unauthorized = (message = "Not authorized") => new ApiError(401, message);
export const notFound = (message = "Not found") => new ApiError(404, message);
