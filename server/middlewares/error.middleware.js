const { ValidationError, UniqueConstraintError } = require('sequelize');
const { ZodError } = require('zod');
const createHttpError = require('http-errors');
const jose = require('jose');
const brevo = require('@getbrevo/brevo');

/**
 *
 * @type {import("express").ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, _next) => {
  console.error(error);
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

  if (error instanceof brevo.HttpError) {
    console.error('HttpError statusCode', error.statusCode);
    console.error('HttpError body', error.body);
    return res.sendStatus(error.statusCode);
  }

  return res.sendStatus(500);
};

module.exports = errorMiddleware;
