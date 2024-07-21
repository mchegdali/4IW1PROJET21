const { z } = require('zod');
const passwordSchema = require('./password.schema');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const { paginationSchema } = require('./pagination.schema');

const userQuerySchema = z
  .object({
    text: z.string().min(2).optional(),
    sortField: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  })
  .merge(paginationSchema);

const userCreateSchema = z.object({
  fullname: z.string().min(2, 'Veuillez renseigner votre nom').trim(),
  email: z.string().email('Adresse email invalide').trim(),
  password: passwordSchema,
  isVerified: z.boolean().default(false),
  role: z.enum(['user', 'admin', 'accountant']).default('user'),
});

const userUpdateSchema = userCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const userSchema = userCreateSchema.merge(entitySchema).merge(timestampsSchema);

/** @typedef { z.infer<typeof userCreateSchema>} UserCreateBody */
/** @typedef { z.infer<typeof userUpdateSchema>} UserUpdateBody */
/** @typedef { z.infer<typeof userSchema>} User */
/** @typedef { z.infer<typeof userQuerySchema>} UserQuery */

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userSchema,
  userQuerySchema,
};
