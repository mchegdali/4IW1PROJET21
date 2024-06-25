//@ts-check
const { z } = require('zod');

const entitySchema = z.object({
  id: z.string().uuid(),
});

/** @typedef { z.infer<typeof entitySchema>} Entity */

module.exports = entitySchema;
