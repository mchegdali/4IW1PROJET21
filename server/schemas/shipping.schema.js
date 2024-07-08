//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');



const shippingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const shippingCreateSchema = z.object({
  fullname: z.string().min(2),
  street: z.string().min(2),
  zipCode: z.string().min(2),
  city: z.string().min(2),
  phone: z.string().min(2),
  deliveryChoiceId: z.string().uuid().or(z.null()).default(null),
  
});

const shippingUpdateSchema = shippingCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const shippingSchema = shippingCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof shippingCreateSchema>} ShippingCreateBody */
/** @typedef { z.infer<typeof shippingUpdateSchema>} ShippingUpdateBody */
/** @typedef { z.infer<typeof shippingSchema>} Shipping */
/** @typedef { z.infer<typeof shippingQuerySchema>} ShippingQuery */

module.exports = {
  shippingQuerySchema: shippingQuerySchema,
  shippingCreateSchema: shippingCreateSchema,
  shippingUpdateSchema: shippingUpdateSchema,
  shippingSchema: shippingSchema,
};
