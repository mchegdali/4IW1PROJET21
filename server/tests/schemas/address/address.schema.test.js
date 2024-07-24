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

  it('should fail validation for incorrect address data', () => {
    const addressInvalid = {
      firstName: 'J',
      lastName: 'D',
      street: '1',
      city: 'P4ris',
      region: 'Îl3-de-Fr4nce',
      zipCode: '7500',
      country: 'Fr4nce',
      phone: '012345678',
    };

    const validation = addressCreateSchema.safeParse(addressInvalid);
    expect(validation.success).toBe(false);
    expect(validation.error.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Prénom invalide' }),
        expect.objectContaining({ message: 'Nom de famille invalide' }),
        expect.objectContaining({ message: 'Adresse invalide.' }),
        expect.objectContaining({ message: 'Ville invalide' }),
        expect.objectContaining({ message: 'Région invalide' }),
        expect.objectContaining({ message: 'Code postal invalide' }),
        expect.objectContaining({ message: 'Pays invalide' }),
        expect.objectContaining({ message: 'Numéro de téléphone invalide' }),
      ]),
    );
  });
});
