import { z } from 'zod';
import { createFixture } from 'zod-fixture';
import { productCreateSchema } from '../schemas/products.schema.js';

export const productGenerator = () => {
  return createFixture(productCreateSchema);
};
