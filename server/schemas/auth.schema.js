import { z } from 'zod';
import passwordSchema from './password.schema.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  fullname: z.string().min(2).trim(),
  email: z.string().email().trim(),
  password: passwordSchema,
});

const confirmSchema = z.object({
  token: z.string('Le token est obligatoire'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export { loginSchema, registerSchema, confirmSchema, forgotPasswordSchema };
