/**
 *
 * @param {import("zod").ZodError} error
 */
function formatZodError(error) {
  return error.flatten();
}

export default formatZodError;
