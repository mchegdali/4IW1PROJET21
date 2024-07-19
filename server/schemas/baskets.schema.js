//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');

const basketCreateSchema = z.object({
  items: z.array(z.string().uuid()),
});

const basketUpdateSchema = basketCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const basketSchema = basketCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof basketCreateSchema>} BasketCreateBody */
/** @typedef { z.infer<typeof basketUpdateSchema>} BasketUpdateBody */
/** @typedef { z.infer<typeof basketSchema>} Basket */

module.exports = {
  basketCreateSchema,
  basketUpdateSchema,
  basketSchema,
};
