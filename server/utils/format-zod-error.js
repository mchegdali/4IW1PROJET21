/**
 *
 * @param {import("zod").ZodError} error
 */
function formatZodError(error) {
  /**
   * @type {Map<string, string>}
   */
  const errorMap = new Map();

  const issuesLen = error.issues.length;

  for (let i = 0; i < issuesLen; i++) {
    const issue = error.issues[i];
    errorMap.set(issue.path.join('.'), issue.message);
  }

  return Object.fromEntries(errorMap);
}

export default formatZodError;
