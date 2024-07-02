//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const slugSchema = require('./slug.schema');
const isUUIDOrSlug = require('../utils/is-uuid-or-slug');

const categoryUUIDOrSlug = z.string().refine((category) => {
  const { isSlug, isUUID } = isUUIDOrSlug(category);
  return isUUID || isSlug;
}, "L'identifiant de la catégorie n'est pas valide");

const categoryCreateSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().min(2),
  })
  .strict();

const categoryUpdateSchema = categoryCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const categorySchema = categoryCreateSchema
  .merge(slugSchema)
  .merge(entitySchema);

/** @typedef { z.infer<typeof categoryCreateSchema>} CategoryCreateBody */
/** @typedef { z.infer<typeof categoryUpdateSchema>} CategoryUpdateBody */
/** @typedef { z.infer<typeof categorySchema>} Category */

module.exports = {
  categoryCreateSchema,
  categoryUpdateSchema,
  categorySchema,
  categoryUUIDOrSlug,
};
