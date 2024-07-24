// orderSchema.test.js
const { z } = require('zod');
const {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
  orderSchema,
} = require('../../../schemas/orders.schema');

describe('Order Schemas', () => {
  test('orderQuerySchema should validate correctly', () => {
    const validData = { page: 1, text: 'some text' };
    const invalidData = { page: -1 };

    expect(() => orderQuerySchema.parse(validData)).not.toThrow();
    expect(() => orderQuerySchema.parse(invalidData)).toThrow();
  });

  test('orderCreateSchema should validate correctly', () => {
    const validData = {
      user: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      address: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
      items: [
        {
          _id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
          name: 'Item 1',
          category: {
            _id: 'f47ac10b-58cc-4372-a567-0e02b2c3d482',
            name: 'Category 1',
            slug: 'category-1',
          },
          price: 100,
        },
      ],
      totalPrice: 100,
    };
    const invalidData = {
      user: 'invalid-uuid',
      address: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    };

    expect(() => orderCreateSchema.parse(validData)).not.toThrow();
    expect(() => orderCreateSchema.parse(invalidData)).toThrow();
  });

  test('orderUpdateSchema should validate correctly', () => {
    const validData = { status: 'f47ac10b-58cc-4372-a567-0e02b2c3d483' };
    const invalidData = {};

    expect(() => orderUpdateSchema.parse(validData)).not.toThrow();
    expect(() => orderUpdateSchema.parse(invalidData)).toThrow();
  });

  test('orderSchema should validate correctly', () => {
    const validData = {
      user: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      address: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
      items: [
        {
          _id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
          name: 'Item 1',
          category: {
            _id: 'f47ac10b-58cc-4372-a567-0e02b2c3d482',
            name: 'Category 1',
            slug: 'category-1',
          },
          price: 100,
        },
      ],
      totalPrice: 100,
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d484',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(() => orderSchema.parse(validData)).not.toThrow();

  });
});
