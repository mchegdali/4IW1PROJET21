const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const { paginationSchema } = require('./pagination.schema');

const statusQuerySchema = z
  .object({
    text: z.string().min(2).optional(),
  })
  .merge(paginationSchema);

const statusCreateSchema = z.object({
  label: z.string().min(1, 'Libellé obligatoire').trim(),
});

const statusUpdateSchema = statusCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const statusSchema = statusCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof statusCreateSchema>} StatusCreateBody */
/** @typedef { z.infer<typeof statusUpdateSchema>} StatusUpdateBody */
/** @typedef { z.infer<typeof statusSchema>} Status */
/** @typedef { z.infer<typeof statusQuerySchema>} StatusQuery */

module.exports = {
  statusCreateSchema,
  statusUpdateSchema,
  statusSchema,
  statusQuerySchema,
};
