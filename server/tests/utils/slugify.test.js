const slugify = require('../../utils/slugify');

describe('slugify', () => {
  it('should return a slugified string', () => {
    const result = slugify('This is a test');
    expect(result).toBe('this-is-a-test');
  });

  it('should return a slugified string from a number', () => {
    const result = slugify(123);
    expect(result).toBe('123');
  });

  it('should return null if the input is not a string or a number', () => {
    const result = slugify({});
    expect(result).toBeNull();
  });

  it('should handle special characters and convert them to slugs', () => {
    const result = slugify('Ceci est un test avec des caractères spéciaux!');
    expect(result).toBe('ceci-est-un-test-avec-des-caracteres-speciaux');
  });
});
