const { paginationSchema } = require('../../schemas/pagination.schema');

describe('Validation du schéma de pagination', () => {
  // Teste la validation des données de pagination correctes
  it('should validate correct pagination data', () => {
    const paginationValid = {
      page: 1,
      pageSize: 25,
    };

    const validation = paginationSchema.safeParse(paginationValid);
    expect(validation.success).toBe(true);
  });

  // Teste l'échec de la validation pour une taille de page invalide
  it('should fail validation for incorrect pageSize', () => {
    const paginationInvalidPageSize = {
      page: 1,
      pageSize: 15,
    };

    const validation = paginationSchema.safeParse(paginationInvalidPageSize);
    expect(validation.success).toBe(false);
    expect(validation.error.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'La limite doit être un des valeurs suivantes: 10, 25, 50, 100' }), // Taille de page invalide
      ]),
    );
  });

  // Teste l'échec de la validation pour un numéro de page invalide
  it('should fail validation for incorrect page number', () => {
    const paginationInvalidPage = {
      page: 0,
      pageSize: 25,
    };

    const validation = paginationSchema.safeParse(paginationInvalidPage);
    expect(validation.success).toBe(false);
    expect(validation.error.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Number must be greater than or equal to 1' }), // Numéro de page invalide
      ]),
    );
  });

  // Teste la validation avec des valeurs par défaut
  it('should validate with default values', () => {
    const paginationDefault = {};

    const validation = paginationSchema.safeParse(paginationDefault);
    expect(validation.success).toBe(true);
    expect(validation.data.page).toBe(1);
    expect(validation.data.pageSize).toBe(10);
  });
});