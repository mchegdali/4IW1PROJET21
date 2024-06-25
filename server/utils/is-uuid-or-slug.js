const validator = require('validator');

/**
 *
 * @param {string} value
 * @returns
 */
function isUUIDOrSlug(value) {
  const isUUID = validator.isUUID(value);
  const isSlug = validator.isSlug(value) && !isUUID;

  return {
    isUUID,
    isSlug,
  };
}

module.exports = isUUIDOrSlug;
