import { z } from 'zod';

const slugSchema = z.object({
  slug: z.string().uuid(),
});

/** @typedef { z.infer<typeof slugSchema>} Slug */

export default slugSchema;
