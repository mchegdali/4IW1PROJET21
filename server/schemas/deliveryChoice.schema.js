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
  

const deliveryChoiceUpdateSchema = deliveryChoiceCreateSchema.partial().refine((a)=> {
  return Object.keys(a).length > 0;
},'Vous devez remplir au moins un champ');

const deliveryChoiceSchema = deliveryChoiceCreateSchema

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