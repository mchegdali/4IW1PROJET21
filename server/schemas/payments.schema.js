//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');

const paymentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const paymentCreateSchema = z.object({
  user: z.string().uuid().optional(),
  shippingId: z.string().uuid().optional(),
  paymentType: z.string().optional(),
});

const paymentUpdateSchema = paymentCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const paymentSchema = paymentCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof paymentCreateSchema>} PaymentCreateBody */
/** @typedef { z.infer<typeof paymentUpdateSchema>} PaymentUpdateBody */
/** @typedef { z.infer<typeof paymentSchema>} Payment */
/** @typedef { z.infer<typeof paymentQuerySchema>} PaymentQuery */

module.exports = {
  paymentQuerySchema,
  paymentCreateSchema,
  paymentUpdateSchema,
  paymentSchema,
};
