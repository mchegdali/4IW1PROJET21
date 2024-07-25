const {
  productQuerySchema,
  productCreateSchema,
  productUpdateSchema,
  productSchema,
} = require('../../../schemas/products.schema');

describe('Product Schemas', () => {
  test('productQuerySchema should validate correct queries', () => {
    const validQuery = {
      page: 1,
      pageSize: 10,
      text: 'example',
      minPrice: 0,
      maxPrice: 100,
    };
    expect(() => productQuerySchema.parse(validQuery)).not.toThrow();
  });

  test('productQuerySchema should throw error for invalid pageSize', () => {
    const invalidQuery = { page: 1, pageSize: 7 };
    expect(() => productQuerySchema.parse(invalidQuery)).toThrow(
      /La limite doit être un des valeurs suivantes:/,
    );
  });

  test('productCreateSchema should validate correct product creation data', () => {
    const validProduct = {
      name: 'Product',
      price: 10.0,
      description: 'Description',
      categoryId: '9f8c4a6b-2c3d-4b9a-bf14-6c4b8d037f5a',
    };
    expect(() => productCreateSchema.parse(validProduct)).not.toThrow();
  });

  test('productUpdateSchema should validate partial updates', () => {
    const validUpdate = { price: 20.0 };
    expect(() => productUpdateSchema.parse(validUpdate)).not.toThrow();
  });

  test('productUpdateSchema should throw error when empty object', () => {
    const invalidUpdate = {};
    expect(() => productUpdateSchema.parse(invalidUpdate)).toThrow(
      'Vous devez spécifier au moins un champ',
    );
  });

  test('productSchema should validate complete product data', () => {
    const validProduct = {
      name: 'Product',
      price: 10.0,
      description: 'Description',
      categoryId: '9f8c4a6b-2c3d-4b9a-bf14-6c4b8d037f5a',
      image: 'https://example.com/image.png',
      slug: 'product-slug',
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(() => productSchema.parse(validProduct)).not.toThrow();
  });
});
