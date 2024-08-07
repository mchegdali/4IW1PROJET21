//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const { paginationSchema } = require('./pagination.schema');

const orderQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    text: z.string().min(2).optional(),
  })
  .merge(paginationSchema);

const orderCreateSchema = z.object({
  user: z.string().uuid(),
  address: z.string().uuid(),
  status: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        _id: z.string().uuid(),
        name: z.string(),
        category: z.object({
          _id: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
        }),
        price: z.number(),
        quantity: z.number().optional(),
        image: z.string().url().optional(),
      }),
    )
    .optional(),
  totalPrice: z.number().optional(),
});

const orderUpdateSchema = orderCreateSchema.partial().refine((data) => {
  return Object.keys(data).length > 0;
}, 'Vous devez spécifier au moins un champ');

const orderSchema = orderCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof orderCreateSchema>} OrderCreateBody */
/** @typedef { z.infer<typeof orderUpdateSchema>} OrderUpdateBody */
/** @typedef { z.infer<typeof orderSchema>} Order */
/** @typedef { z.infer<typeof orderQuerySchema>} OrderQuery */

module.exports = {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
  orderSchema,
};
