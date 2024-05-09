/**
 *
 * @param {import("@vinejs/vine").errors.E_VALIDATION_ERROR} error
 */
function errorReporter(error) {
  return error.messages.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.field]: curr.message,
    }),
    {},
  );
}

export default errorReporter;
