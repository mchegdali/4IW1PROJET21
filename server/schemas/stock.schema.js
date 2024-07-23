//@ts-check
const { z } = require('zod');
const entitySchema = require('./entity.schema');
const timestampsSchema = require('./timestamps.schema');

const pageSizeValues = [5, 10, 25, 50, 100];

const stockItemQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .default(10)
    .refine((n) => pageSizeValues.includes(n), {
      message: `La limite doit être un des valeurs suivantes: ${pageSizeValues.join(', ')}`,
    }),
  productId: z.string().uuid().optional(),
  expirationDateBefore: z.coerce.date().optional(),
  expirationDateAfter: z.coerce.date().optional(),
});

const stockItemCreateSchema = z.object({
  productId: z.string().uuid(),
  expirationDate: z.coerce.date(),
});

const stockItemUpdateSchema = z
  .object({
    expirationDate: z.coerce.date(),
  })
  .partial()
  .refine((data) => {
    return Object.keys(data).length > 0;
  }, 'Vous devez spécifier au moins un champ');

const productSubSchema = z.object({
  _id: z.string().uuid(),
  name: z.string(),
  category: z
    .object({
      _id: z.string().uuid(),
      name: z.string(),
    })
    .nullable(),
  price: z.string(), // Assuming price is stored as a string in Mongo
});

const stockItemSchema = stockItemCreateSchema
  .merge(entitySchema)
  .merge(timestampsSchema)
  .extend({
    product: productSubSchema,
  });

/** @typedef { z.infer<typeof stockItemCreateSchema>} StockItemCreateBody */
/** @typedef { z.infer<typeof stockItemUpdateSchema>} StockItemUpdateBody */
/** @typedef { z.infer<typeof stockItemSchema>} StockItem */
/** @typedef { z.infer<typeof stockItemQuerySchema>} StockItemQuery */

module.exports = {
  stockItemQuerySchema,
  stockItemCreateSchema,
  stockItemUpdateSchema,
  stockItemSchema,
};
