const _slugify = require('slugify');

/**
 *
 * @param {string} str
 * @returns
 */
function slugify(str) {
  if (typeof str !== 'string') return str;
  return _slugify(str, {
    replacement: '-',
    lower: true,
    strict: true,
    trim: true,
    locale: 'fr',
  });
}

module.exports = slugify;
