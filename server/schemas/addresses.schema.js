const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const { paginationSchema } = require('./pagination.schema');

const addressQuerySchema = z
  .object({
    text: z.string().min(2).optional(),
  })
  .merge(paginationSchema);

const addressCreateSchema = z.object({
  name: z.string().min(2),
  street: z.string().min(2),
  city: z.string().min(2),
  zipCode: z.string().min(2),
});

const addressUpdateSchema = addressCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const addressSchema = addressCreateSchema.merge(entitySchema).merge(timestampsSchema);

module.exports = {
  addressCreateSchema,
  addressUpdateSchema,
  addressSchema,
  addressQuerySchema,
};
