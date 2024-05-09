import vine from '@vinejs/vine';

const productQuerySchema = vine.object({
  page: vine.number().withoutDecimals().min(1).optional(),
  text: vine.string().minLength(2).optional(),
});

export { productQuerySchema };
