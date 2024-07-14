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
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  street: z.string().min(2),
  city: z.string().min(2),
  region: z.string().min(2),
  zipCode: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().min(10),
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
