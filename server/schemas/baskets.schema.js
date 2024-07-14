//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');



const basketQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const basketCreateSchema = z.object({
  itemsProduct: z.array(z.string().uuid()).optional(),
});

const basketUpdateSchema = basketCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const basketSchema = basketCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof basketCreateSchema>} ShippingCreateBody */
/** @typedef { z.infer<typeof basketUpdateSchema>} ShippingUpdateBody */
/** @typedef { z.infer<typeof basketSchema>} Shipping */
/** @typedef { z.infer<typeof basketQuerySchema>} ShippingQuery */

module.exports = {
  basketQuerySchema: basketQuerySchema,
  basketCreateSchema: basketCreateSchema,
  basketUpdateSchema: basketUpdateSchema,
  basketSchema: basketSchema,
};
