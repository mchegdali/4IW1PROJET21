const { categoryCreateSchema } = require('../../../schemas/categories.schema.js');

describe('Category Schema Validation', () => {
  it('should validate correct category data', () => {
    const categoryValid = {
      name: 'Electronics',
      description: 'Devices and gadgets',
    };
    const validation = categoryCreateSchema.safeParse(categoryValid);
    expect(validation.success).toBe(true);
  });

  it('should fail validation for incorrect category data', () => {
    const categoryInvalid = {
      name: 'E',
      description: '',
    };

    const validation = categoryCreateSchema.safeParse(categoryInvalid);
    expect(validation.success).toBe(false);
    expect(validation.error.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'String must contain at least 2 character(s)' }),
        expect.objectContaining({ message: 'String must contain at least 2 character(s)' }),
      ]),
    );
  });
});
