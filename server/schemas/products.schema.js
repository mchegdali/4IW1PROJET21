//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const slugSchema = require('./slug.schema');

const pageSizeValues = [5, 10, 25, 50, 100];

const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .default(10)
    .refine((n) => pageSizeValues.includes(n), {
      message: `La limite doit être un des valeurs suivantes: ${pageSizeValues.join(', ')}`,
    }),
  text: z.string().min(2).optional(),
  minPrice: z.coerce.number().min(0).finite().optional(),
  maxPrice: z.coerce.number().min(0).finite().optional(),
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

module.exports = {
  productQuerySchema,
  productCreateSchema,
  productUpdateSchema,
  productSchema,
};
