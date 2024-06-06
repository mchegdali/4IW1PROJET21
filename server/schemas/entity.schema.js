import { z } from 'zod';

const entitySchema = z.object({
  id: z.string().uuid(),
});

/** @typedef { z.infer<typeof entitySchema>} Entity */

export default entitySchema;
