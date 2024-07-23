const { z } = require('zod');
const passwordSchema = require('./password.schema');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const { paginationSchema } = require('./pagination.schema');

const userQuerySchema = z
  .object({
    text: z.string().min(2).nullable().optional(),
    sortField: z.enum(['id', 'fullname', 'email']).optional().default('id'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  })
  .merge(paginationSchema);

const userAlertsSchema = z.object({
  newProductAlert: z.boolean(),
  restockAlert: z.boolean(),
  priceChangeAlert: z.boolean(),
  newsletterAlert: z.boolean(),
});

const userAlertsCreateSchema = z.object({
  newProductAlert: z.boolean().default(false),
  restockAlert: z.boolean().default(false),
  priceChangeAlert: z.boolean().default(false),
  newsletterAlert: z.boolean().default(false),
});

const userAlertsUpdateSchema = userAlertsSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const userCreateSchema = z
  .object({
    fullname: z.string().min(2, 'Veuillez renseigner votre nom').trim(),
    email: z.string().email('Adresse email invalide').trim(),
    password: passwordSchema,
    isVerified: z.boolean().default(false),
    role: z.enum(['user', 'admin', 'accountant']).default('user'),
  })
  .merge(userAlertsCreateSchema);

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
  userAlertsUpdateSchema,
};
