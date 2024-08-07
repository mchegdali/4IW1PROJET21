//@ts-check
const { z } = require('zod');
const passwordSchema = require('./password.schema');

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  password: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
});

const resendConfirmationEmailSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
});

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

module.exports = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  resendConfirmationEmailSchema,
};
