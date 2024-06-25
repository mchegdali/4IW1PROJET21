const { z } = require('zod');
const passwordSchema = require('./password.schema');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');

const limitValues = [10, 25, 50, 100];
const offsetValues = [0, 10, 25, 50, 100];

const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .default(10)
    .refine((n) => limitValues.includes(n), {
      message: `La limite doit être un des valeurs suivantes: ${limitValues.join(', ')}`,
    }),
  offset: z.coerce
    .number()
    .int()
    .default(0)
    .refine((n) => offsetValues.includes(n), {
      message: `L'offset doit être un des valeurs suivantes: ${offsetValues.join(', ')}`,
    }),
  text: z.string().min(2).optional(),
});

const userCreateSchema = z.object({
  fullname: z.string().min(2).trim(),
  email: z.string().email().trim(),
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
