const { ValidationError, UniqueConstraintError } = require('sequelize');
const { ZodError } = require('zod');
const createHttpError = require('http-errors');
const jose = require('jose');

/**
 *
 * @type {import("express").ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    const flattenedErrors = {};
    for (const err of error.issues) {
      flattenedErrors[err.path] = err.message;
    }

    return res.status(422).json(flattenedErrors);
  }

  if (error instanceof UniqueConstraintError) {
    const flattenedErrors = {};

    for (const err of error.errors) {
      flattenedErrors[err.path] = err.message;
    }

    return res.status(409).json(flattenedErrors);
  }

  if (error instanceof ValidationError) {
    const flattenedErrors = {};

    for (const err of error.errors) {
      flattenedErrors[err.path] = err.message;
    }

    return res.status(422).json(flattenedErrors);
  }
  if (error instanceof jose.errors.JOSEError) {
    return res.sendStatus(401);
  }
  if (createHttpError.isHttpError(error)) {
    return res.sendStatus(error.statusCode);
  }

  return res.sendStatus(500);
};

module.exports = errorMiddleware;
