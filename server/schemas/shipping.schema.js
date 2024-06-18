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
    fullname: z.string().min(2),
    street: z.string().min(5),
    zipCode: z.string().min(2),
    city: z.string().min(2),
    phone: z.string().min(10)
    
  })
  .transform((data) => ({
    emailCustomer: data.emailCustomer,
    fullname: data.fullname,
    street: data.street,
    city: data.city,
    phone: data.phone,
    zipCode: data.zipCode,
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