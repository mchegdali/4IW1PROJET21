import { ValidationError } from 'sequelize';
import { ZodError } from 'zod';
import createHttpError from 'http-errors';

/**
 *
 * @type {import("express").ErrorRequestHandler}
 */
const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      errors: error.formErrors.fieldErrors,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(422).json({ errors: error.errors });
  }

  if (createHttpError.isHttpError(error)) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof Error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: 'Erreur interne',
  });
};

export default errorMiddleware;
