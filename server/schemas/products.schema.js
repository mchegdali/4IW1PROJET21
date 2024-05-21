//@ts-check
import { z } from 'zod';
import entitySchema from './entity.schema.js';
import timestampsSchema from './timestamps.schema.js';
import slugSchema from './slug.schema.js';

const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const productCreateSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0.01),
  description: z.string().min(2),
  image: z
    .string()
    .url()
    .default('https://placehold.co/256x256/38664D/FFF/png'),
});

const productUpdateSchema = productCreateSchema.partial();

const productSchema = productCreateSchema
  .merge(slugSchema)
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof productCreateSchema>} ProductCreateBody */
/** @typedef { z.infer<typeof productUpdateSchema>} ProductUpdateBody */
/** @typedef { z.infer<typeof productSchema>} Product */
/** @typedef { z.infer<typeof productQuerySchema>} ProductQuery */

export {
  productQuerySchema,
  productCreateSchema,
  productUpdateSchema,
  productSchema,
};
