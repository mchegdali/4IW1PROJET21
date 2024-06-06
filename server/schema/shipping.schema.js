import { z } from 'zod';
import entitySchema from './entity.schema.js';
import timestampsSchema from './timestamps.schema.js';
import slugSchema from './slug.schema.js';

const shippingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const shippingCreateSchema = z
  .object({
    emailCustomer: z.string().min(5, {
        message: "5 characters minimum"
    }).email({
        message: "Invalid email"
    }),

    country: z.number().min(0.01),
    street: z.string().min(5),
    zipCode: z.number().min(2),
    city: z.string.min(2),
    phone: z.string.min(10)
    
  })
  .transform((data) => ({
    emailCustomer: data.emailCustomer,
    country: data.country,
    street: data.street,
    city: data.city,
    phone: data.phone,
  }));

const shippingUpdateSchema = shippingCreateSchema.innerType().partial();

const shippingSchema = shippingCreateSchema
  .innerType()
  .merge(slugSchema)
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof productCreateSchema>} ProductCreateBody */
/** @typedef { z.infer<typeof productUpdateSchema>} ProductUpdateBody */
/** @typedef { z.infer<typeof productSchema>} Product */
/** @typedef { z.infer<typeof productQuerySchema>} ProductQuery */

export {
  shippingQuerySchema,
  shippingCreateSchema,
  shippingUpdateSchema,
  shippingSchema,
};