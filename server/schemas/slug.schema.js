//@ts-check
const validator = require('validator');
const { z } = require('zod');

const slugSchema = z.object({
  slug: z
    .string()
    .refine((arg) => validator.isSlug(arg), "Le slug n'est pas valide"),
});

/** @typedef { z.infer<typeof slugSchema>} Slug */

module.exports = slugSchema;
