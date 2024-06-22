//@ts-check
import { z } from 'zod';
import entitySchema from './entity.schema.js';
import slugSchema from './slug.schema.js';
import isUUIDOrSlug from '../utils/is-uuid-or-slug.js';

const productCategoryUUIDOrSlug = z.string().refine((category) => {
  const { isSlug, isUUID } = isUUIDOrSlug(category);
  return isUUID || isSlug;
}, "L'identifiant de la catégorie n'est pas valide");

const productCategoryCreateSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().min(2),
  })
  .strict();

const productCategoryUpdateSchema = productCategoryCreateSchema
  .partial()
  .refine((a) => {
    return Object.keys(a).length > 0;
  }, 'Vous devez spécifier au moins un champ');

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
  productCategoryUUIDOrSlug,
};
