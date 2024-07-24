const { categoryCreateSchema } = require('../../schemas/categories.schema.js');

describe('Category Schema Validation', () => {
  describe('CategoryCreateSchema', () => {
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
        ])
      );
    });

    it('should fail validation for an empty object', () => {
      const categoryEmpty = {};
      const validation = categoryCreateSchema.safeParse(categoryEmpty);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Required' }),
          expect.objectContaining({ message: 'Required' }),
        ])
      );
    });

    it('should fail validation for extra properties', () => {
      const categoryExtraProps = {
        name: 'Electronics',
        description: 'Devices and gadgets',
        extraField: 'This should not be here',
      };
      const validation = categoryCreateSchema.safeParse(categoryExtraProps);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Unrecognized key(s) in object: \'extraField\'' }),
        ])
      );
    });

    it('should fail validation for non-string values', () => {
      const categoryNonString = {
        name: 123,
        description: true,
      };
      const validation = categoryCreateSchema.safeParse(categoryNonString);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Expected string, received number' }),
          expect.objectContaining({ message: 'Expected string, received boolean' }),
        ])
      );
    });
  });
});