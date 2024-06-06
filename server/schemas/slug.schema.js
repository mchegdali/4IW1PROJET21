import validator from 'validator';
import { z } from 'zod';

const slugSchema = z.object({
  slug: z
    .string()
    .refine((arg) => validator.isSlug(arg), "Le slug n'est pas valide"),
});

/** @typedef { z.infer<typeof slugSchema>} Slug */

export default slugSchema;
