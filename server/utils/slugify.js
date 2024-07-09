const _slugify = require('slugify');

/**
 *
 * @param {string | number} value
 * @returns {string | null}
 */
function slugify(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const slug = typeof value === 'string' ? value : value.toString();

  return _slugify(slug, {
    replacement: '-',
    lower: true,
    strict: true,
    trim: true,
    locale: 'fr',
  });
}

module.exports = slugify;
