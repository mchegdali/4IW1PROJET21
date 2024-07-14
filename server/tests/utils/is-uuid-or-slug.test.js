const isUUIDOrSlug = require('../../utils/is-uuid-or-slug');

describe('isUUIDOrSlug', () => {
  it('should return true for UUID', () => {
    const result = isUUIDOrSlug('3b121d13-7c1f-4049-b245-f6c4ed88f92f');
    expect(result.isUUID).toBe(true);
    expect(result.isSlug).toBe(false);
  });

  it('should return true for slug', () => {
    const result = isUUIDOrSlug('this-is-a-slug');
    expect(result.isUUID).toBe(false);
    expect(result.isSlug).toBe(true);
  });

  it('should return false for neither', () => {
    const result = isUUIDOrSlug('this is not a slug or a UUID');
    expect(result.isUUID).toBe(false);
    expect(result.isSlug).toBe(false);
  });
});
