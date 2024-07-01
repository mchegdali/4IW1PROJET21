const { ValidationError } = require('sequelize');
const { ZodError } = require('zod');
const createHttpError = require('http-errors');

/**
 *
 * @type {import("express").ErrorRequestHandler}
 */
const errorMiddleware = (error, req, res) => {
  if (error instanceof ZodError) {
    const flattenedErrors = {};
    for (const err of error.issues) {
      flattenedErrors[err.path] = err.message;
    }

    return res.status(422).json(flattenedErrors);
  }

  if (error instanceof ValidationError) {
    const flattenedErrors = {};

    for (const err of error.errors) {
      flattenedErrors[err.path] = err.message;
    }

    return res.status(422).json(flattenedErrors);
  }

  if (createHttpError.isHttpError(error)) {
    return res.sendStatus(error.statusCode);
  }

  return res.sendStatus(500);
};

module.exports = errorMiddleware;
