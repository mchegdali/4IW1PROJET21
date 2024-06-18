import { z } from 'zod';
import validator from 'validator';

const passwordSchema = z.string().refine(
  (pwd) => {
    return validator.isStrongPassword(pwd, {
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  },
  {
    message:
      'Le mot de passe doit contenir au moins 12 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial',
  },
);

export default passwordSchema;
