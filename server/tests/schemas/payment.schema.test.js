const { paymentCreateSchema, paymentUpdateSchema } = require('../../schemas/payments.schema');

describe('Validation des schémas de paiement', () => {
  // Validation du schéma de création de paiement
  describe('paymentCreateSchema', () => {
    // Teste la validation des données de paiement correctes
    it('should validate correct payment data', () => {
      const paymentValid = {
        order: '550e8400-e29b-41d4-a716-446655440000', // UUID valide
      };

      const validation = paymentCreateSchema.safeParse(paymentValid);
      expect(validation.success).toBe(true);
    });

    // Teste l'échec de la validation des données de paiement incorrectes
    it('should fail validation for incorrect payment data', () => {
      const paymentInvalid = {
        order: 'invalid-uuid',
      };

      const validation = paymentCreateSchema.safeParse(paymentInvalid);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Invalid uuid' }), // UUID invalide
        ]),
      );
    });
  });

  // Validation du schéma de mise à jour de paiement
  describe('paymentUpdateSchema', () => {
    // Teste la validation des données partielles de paiement correctes
    it('should validate partial payment data', () => {
      const paymentPartialValid = {
        order: '550e8400-e29b-41d4-a716-446655440000', // UUID valide
      };

      const validation = paymentUpdateSchema.safeParse(paymentPartialValid);
      expect(validation.success).toBe(true);
    });

    // Teste l'échec de la validation pour un objet vide
    it('should fail validation for an empty object', () => {
      const paymentEmpty = {};

      const validation = paymentUpdateSchema.safeParse(paymentEmpty);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Vous devez spécifier au moins un champ' }), // Message d'erreur pour objet vide
        ]),
      );
    });
  });
});