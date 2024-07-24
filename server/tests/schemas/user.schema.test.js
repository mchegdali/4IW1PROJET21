const { userCreateSchema, userUpdateSchema } = require('../../schemas/user.schema');

describe('Validation des schémas d\'utilisateur', () => {
  // Validation du schéma de création d'utilisateur
  describe('userCreateSchema', () => {
    // Teste la validation des données utilisateur correctes
    it('should validate correct user data', () => {
      const userValid = {
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecureP@ssw0rd1!',
        isVerified: true,
        role: 'user',
        newProductAlert: true,
        restockAlert: true,
        priceChangeAlert: false,
        newsletterAlert: false,
      };

      const validation = userCreateSchema.safeParse(userValid);
      expect(validation.success).toBe(true);
    });

    // Teste l'échec de la validation des données utilisateur incorrectes
    it('should fail validation for incorrect user data', () => {
      const userInvalid = {
        fullname: 'J',
        email: 'invalid-email',
        password: 'short',
        isVerified: 'yes',
        role: 'superuser',
        newProductAlert: 'true',
        restockAlert: 'true',
        priceChangeAlert: 'false',
        newsletterAlert: 'false',
      };

      const validation = userCreateSchema.safeParse(userInvalid);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
        expect.objectContaining({ message: 'Veuillez renseigner votre nom' }), // Nom
        expect.objectContaining({ message: 'Adresse email invalide' }), // Email
        expect.objectContaining({ message: 'Le mot de passe doit contenir au moins 12 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial' }), // Mot de passe
        expect.objectContaining({ message: 'Expected boolean, received string' }), // isVerified
        expect.objectContaining({ message: 'Invalid enum value. Expected \'user\' | \'admin\' | \'accountant\', received \'superuser\'' }), // Rôle
        expect.objectContaining({ message: 'Expected boolean, received string' }), // newProductAlert
        ]),
      );
    });
  });

  // Validation du schéma de mise à jour d'utilisateur
  describe('userUpdateSchema', () => {
    // Teste la validation des données partielles utilisateur correctes
    it('should validate partial user data', () => {
      const userPartialValid = {
        fullname: 'John Doe',
      };

      const validation = userUpdateSchema.safeParse(userPartialValid);
      expect(validation.success).toBe(true);
    });

    // Teste l'échec de la validation pour un objet vide
    it('should fail validation for an empty object', () => {
      const userEmpty = {};

      const validation = userUpdateSchema.safeParse(userEmpty);
      expect(validation.success).toBe(false);
      expect(validation.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Vous devez spécifier au moins un champ' }),
        ]),
      );
    });
  });
});
