import { fullName, address } from './verifLivraisonForm';
// verifLivraisonForm.ts
import { computed, ref } from 'vue';
import { z } from 'Zod';

const emailSchema = z.string()
    .min(5, { message: "5 characters minimum" })
    .max(30, {  message: "30 characters maximum" })
    .email({ message: "Invalid email" });
const fullNameSchema = z.string()
    .min(4, { message: "4 characters minimum" })
    .max(50, { message: "50 characters maximum" })
    .regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s'-]+$/, { message: "Contains invalid characters" });
const addressSchema = z.string()
    .min(10, { message: "10 characters minimum" })
    .max(60, { message: "60 characters maximum" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Invalid address" });
const codePostalSchema = z.coerce.number()
    .gte(1000, { message: "Postal code must be at least 4 digits" })
    .lte(9999, { message: "Postal code must be at most 4 digits" });
const phoneNumberSchema = z.string()
    .length(10, { message: "Phone number must be 10 digits" })
    .regex(/^\d{10}$/, { message: "Invalid phone number" });
const citySchema = z.string()
    .min(2, { message: "2 characters minimum" })
    .max(25, { message: "25 characters maximum" })
    .regex(/^[a-zA-Z]+$/, { message: "Invalid city" });

const email = ref("");
const fullName = ref("");
const address = ref("");
const phoneNumber = ref("");
const city = ref("");
const codePostal = ref("");

const formSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
  address: addressSchema,
  phoneNumber: phoneNumberSchema,
  codePostal: codePostalSchema,
  city: citySchema,
});

const formErrors = computed(() => {
  const formData = {
    email: email.value,
    fullName: fullName.value,
    address: address.value,
    phoneNumber: phoneNumber.value,
    codePostal: codePostal.value,
    city: city.value,
  };
  
  const result = formSchema.safeParse(formData);
  if (result.success) {
    return {};
  }
  
  return result.error.issues.reduce((acc: Record<string, string>, issue) => {
    if (typeof issue.path[0] === 'string') {
      acc[issue.path[0]] = issue.message;
    }
    return acc;
  }, {});
});

 const isFormValid = computed(() => {
  return Object.keys(formErrors.value).length === 0;
});
