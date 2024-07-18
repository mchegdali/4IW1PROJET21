const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');
const { paginationSchema } = require('./pagination.schema');

const addressQuerySchema = z
  .object({
    text: z.string().min(2).optional(),
  })
  .merge(paginationSchema);

const nameRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/;
const streetRegex = /^[a-zA-Z0-9À-ÿ '-]{2,}$/;
const cityRegionCountryRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/;
const zipCodeRegex = /^[0-9]{5}$/;
const phoneRegex = /^[0-9]{10}$/;

const addressCreateSchema = z.object({
  firstName: z.string().regex(nameRegex, 'Prénom invalide'),
  lastName: z.string().regex(nameRegex, 'Nom de famille invalide'),
  street: z.string().regex(streetRegex, 'Adresse invalide.'),
  city: z.string().regex(cityRegionCountryRegex, 'Ville invalide'),
  region: z.string().regex(cityRegionCountryRegex, 'Région invalide'),
  zipCode: z.string().regex(zipCodeRegex, 'Code postal invalide'),
  country: z.string().regex(cityRegionCountryRegex, 'Pays invalide'),
  phone: z.string().regex(phoneRegex, 'Numéro de téléphone invalide'),
});

const addressUpdateSchema = addressCreateSchema.partial().refine((a) => {
  return Object.keys(a).length > 0;
}, 'Vous devez spécifier au moins un champ');

const addressSchema = addressCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema);

module.exports = {
  addressCreateSchema,
  addressUpdateSchema,
  addressSchema,
  addressQuerySchema,
};
