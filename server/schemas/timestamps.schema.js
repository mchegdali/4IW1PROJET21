//@ts-check
import { z } from 'zod';

const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/** @typedef { z.output<typeof timestampsSchema>} Timestamps */

export default timestampsSchema;
