const { addressCreateSchema } = require('../../../schemas/addresses.schema.js');

describe('Address Schema Validation', () => {
  it('should validate correct address data', () => {
    const addressValid = {
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'Paris',
      region: 'Île-de-France',
      zipCode: '75001',
      country: 'France',
      phone: '0123456789',
    };

    const validation = addressCreateSchema.safeParse(addressValid);
    expect(validation.success).toBe(true);
  });
});
