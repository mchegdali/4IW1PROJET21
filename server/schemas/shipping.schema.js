//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');

const nameRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/;
const streetRegex = /^[a-zA-Z0-9À-ÿ '-]{2,}$/;
const cityRegionCountryRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/;
const zipCodeRegex = /^[0-9]{5}$/;
const phoneRegex = /^[0-9]{10}$/;

const addressSchema = z.object({
    firstName: z.string().regex(nameRegex, 'Prénom invalide'),
    lastName: z.string().regex(nameRegex, 'Nom de famille invalide'),
    street: z.string().regex(streetRegex, 'Adresse invalide.'),
    city: z.string().regex(cityRegionCountryRegex, 'Ville invalide'),
    region: z.string().regex(cityRegionCountryRegex, 'Région invalide'),
    zipCode: z.string().regex(zipCodeRegex, 'Code postal invalide'),
    country: z.string().regex(cityRegionCountryRegex, 'Pays invalide'),
    phone: z.string().regex(phoneRegex, 'Numéro de téléphone invalide'),
});

const shippingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  text: z.string().min(2).optional(),
});

const shippingCreateSchema = z.object({
  address: addressSchema.optional(),
  deliveryChoice: z.string().uuid().or(z.null()).default(null).optional(),
});

const shippingUpdateSchema = shippingCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const shippingSchema = shippingCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

/** @typedef { z.infer<typeof shippingCreateSchema>} ShippingCreateBody */
/** @typedef { z.infer<typeof shippingUpdateSchema>} ShippingUpdateBody */
/** @typedef { z.infer<typeof shippingSchema>} Shipping */
/** @typedef { z.infer<typeof shippingQuerySchema>} ShippingQuery */

module.exports = {
  shippingQuerySchema: shippingQuerySchema,
  shippingCreateSchema: shippingCreateSchema,
  shippingUpdateSchema: shippingUpdateSchema,
  shippingSchema: shippingSchema,
};
