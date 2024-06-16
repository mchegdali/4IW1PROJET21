//@ts-check
import { z } from 'zod';
import entitySchema from './entity.schema.js';
import timestampsSchema from './timestamps.schema.js';
import slugSchema from './slug.schema.js';

const limitValues = [10, 25, 50, 100];
const offsetValues = [0, 10, 25, 50, 100];

const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .default(10)
    .refine((n) => limitValues.includes(n), {
      message: `La limite doit être un des valeurs suivantes: ${limitValues.join(', ')}`,
    }),
  offset: z.coerce
    .number()
    .int()
    .default(0)
    .refine((n) => offsetValues.includes(n), {
      message: `L'offset doit être un des valeurs suivantes: ${offsetValues.join(', ')}`,
    }),
  text: z.string().min(2).optional(),
});

const productCreateSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0.01),
  description: z.string().min(2),
  categoryId: z.string().uuid().or(z.null()).default(null),
  image: z
    .string()
    .url()
    .default('https://placehold.co/256x256/38664D/FFF/png'),
});

const productUpdateSchema = productCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

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
