//@ts-check
import { z } from 'zod';
import entitySchema from './entity.schema.js';
import slugSchema from './slug.schema.js';

const productCategoryCreateSchema = z.object({
  name: z.string().min(2),
});

const productCategoryUpdateSchema = productCategoryCreateSchema.partial();

const productCategorySchema = productCategoryCreateSchema
  .merge(slugSchema)
  .merge(entitySchema);

/** @typedef { z.infer<typeof productCategoryCreateSchema>} ProductCategoryCreateBody */
/** @typedef { z.infer<typeof productCategoryUpdateSchema>} ProductCategoryUpdateBody */
/** @typedef { z.infer<typeof productCategorySchema>} ProductCategory */

export {
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
  productCategorySchema,
};
