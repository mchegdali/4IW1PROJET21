import { ref } from "vue";
import { z, ZodSchema } from "zod";

export const useForm = <T extends Record<string, any>>(schema: ZodSchema<T>, initialData: T) => {
  const formData = ref<T>(initialData);
  const formErrors = ref<Record<string, string>>({});
  const formSubmitting = ref(false);

  const validateForm = () => {
    try {
      schema.parse(formData.value);
      formErrors.value = {};
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        formErrors.value = errors;
      }
      return false;
    }
  };

  const submitForm = async (callback: (data: T) => Promise<void>) => {
    if (!validateForm()) {
      return;
    }

    formSubmitting.value = true;
    try {
      await callback(formData.value);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      formSubmitting.value = false;
    }
  };

  return {
    formData,
    formErrors,
    formSubmitting,
    validateForm,
    submitForm
  };
};
