const { z } = require('zod');
const entitySchema = require('./entity.schema.js');
const timestampsSchema = require('./timestamps.schema.js');

const deliveryChoiceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const deliveryChoiceCreateSchema = z
  .object({
    name: z.string().min(2),
  })
  .transform((data) => ({
    name: data.name,
  }));

const deliveryChoiceUpdateSchema = deliveryChoiceCreateSchema.innerType().partial();

const deliveryChoiceSchema = deliveryChoiceCreateSchema
  .innerType()
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof deliveryChoicereateSchema>} DeliveryChoiceCreateBody */
/** @typedef { z.infer<typeof deliveryChoiceUpdateSchema>} DeliveryChoicesUpdateBody */
/** @typedef { z.infer<typeof deliveryChoiceSchema>} DeliveryChoice */
/** @typedef { z.infer<typeof deliveryChoiceQuerySchema>} DeliveryChoiceQuery */

module.exports = {
  deliveryChoiceQuerySchema,
  deliveryChoiceCreateSchema,
  deliveryChoiceUpdateSchema,
  deliveryChoiceSchema,
};