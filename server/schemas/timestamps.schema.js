//@ts-check
const { z } = require('zod');

const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/** @typedef { z.output<typeof timestampsSchema>} Timestamps */

module.exports = timestampsSchema;
