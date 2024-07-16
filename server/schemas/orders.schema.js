//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');


const orderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});


const orderCreateSchema = z.object({
  user: z.string().uuid().or(z.null()).default(null),
});

const orderUpdateSchema = orderCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const orderSchema = orderCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof orderCreateSchema>} ProductCreateBody */
/** @typedef { z.infer<typeof orderUpdateSchema>} ProductUpdateBody */
/** @typedef { z.infer<typeof orderSchema>} Product */
/** @typedef { z.infer<typeof orderQuerySchema>} ProductQuery */

module.exports = {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
  orderSchema,
};
