const { z } = require('zod');

const limitValues = [10, 25, 50, 100];

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .default(10)
    .refine((n) => limitValues.includes(n), {
      message: `La limite doit être un des valeurs suivantes: ${limitValues.join(', ')}`,
    }),
});

module.exports = {
  paginationSchema,
};
