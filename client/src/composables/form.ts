import { computed, reactive, ref } from 'vue';
import { ZodError, type ZodTypeAny } from 'zod';

export function useForm<TSchema extends ZodTypeAny>(options: {
  validationSchema: TSchema;
  defaultValues: TSchema['_input'];
  transform?: TSchema['transform'];
}) {
  const abortController = ref<AbortController>(new AbortController());
  const { validationSchema, defaultValues = null, transform } = options;
  const formValues = ref<TSchema['_input']>(defaultValues);
  const status = ref<number | null>(null);
  const fetchErrors = ref<Record<string, string> | null>(null);

  const formErrors = reactive<Map<keyof TSchema['_input'], string>>(new Map());
  const errors = computed(() => {
    return Object.fromEntries(formErrors.entries()) as Record<keyof TSchema['_input'], string>;
  });
  const isSubmitting = ref(false);
  const isError = ref(false);
  const isSuccess = ref(false);

  function reset() {
    if (defaultValues) {
      formValues.value = defaultValues;
    }
    formErrors.clear();
    isSubmitting.value = false;
    status.value = null;
  }

  function defineField(name: keyof TSchema['_input']) {
    function onInput(e: Event) {
      if (formErrors.has(name)) {
        formErrors.delete(name);
      }

      isError.value = false;
      if (e.target instanceof HTMLInputElement) {
        if (e.target.type === 'checkbox') {
          formValues.value[name] = e.target.checked;
        } else {
          formValues.value[name] = e.target.value;
        }
      } else if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        formValues.value[name] = e.target.value;
      }
    }

    return [formValues.value[name], { onInput }] as const;
  }

  function cancel() {
    abortController.value.abort();
  }

  function handleSubmit(
    onSubmit: (data: TSchema['_output'], signal?: AbortSignal) => Promise<void> | void,
    onInvalidSubmit?: (errors: Record<keyof TSchema['_input'], string>) => void,
    onCancel?: () => void
  ) {
    return async (_e: Event) => {
      const schema = transform ? validationSchema.transform(transform) : validationSchema;

      const { data, success, error } = schema.safeParse(formValues.value);

      if (!success) {
        isError.value = true;
        isSuccess.value = false;
        isSubmitting.value = false;

        for (const [key, value] of Object.entries(error.formErrors.fieldErrors) as [
          keyof TSchema['_input'],
          ZodError['formErrors']['fieldErrors'][keyof TSchema['_input']]
        ][]) {
          if (Array.isArray(value)) {
            formErrors.set(key, value[0]);
          }
        }

        if (onInvalidSubmit) {
          onInvalidSubmit(errors.value);
        }
        return;
      }

      isSubmitting.value = true;

      try {
        await onSubmit(data, abortController.value.signal);

        isSuccess.value = true;
        isError.value = false;
        isSubmitting.value = false;
        status.value = null;
      } catch (error) {
        isError.value = true;
        isSuccess.value = false;
        isSubmitting.value = false;

        if (error instanceof Response) {
          status.value = error.status;
          if (error.headers.get('content-type')?.includes('application/json')) {
            try {
              const body = await error.json();
              for (const [key, value] of Object.entries(body)) {
                console.log('key', key);
                console.log('value', value);

                if (Array.isArray(value)) {
                  formErrors.set(key, value[0]);
                } else if (typeof value === 'string') {
                  formErrors.set(key, value);
                }
              }
            } catch (error) {
              console.error('Error parsing JSON response', error);
            }
          }
        } else if (error instanceof DOMException) {
          if (onCancel) {
            onCancel();
          }
        }
      }
    };
  }

  return {
    handleSubmit,
    reset,
    isSubmitting,
    isError,
    isSuccess,
    formValues,
    errors,
    defineField,
    status,
    fetchErrors,
    cancel
  };
}
