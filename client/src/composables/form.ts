import { computed, isRef, reactive, ref, type Ref } from 'vue';
import { ZodError, type ZodTypeAny } from 'zod';
import deepEqual from 'deep-eql';

export function useForm<TSchema extends ZodTypeAny>(options: {
  validationSchema: TSchema;
  defaultValues: TSchema['_input'] | Ref<TSchema['_input']>;
  transform?: Parameters<TSchema['transform']>[0];
}) {
  const abortController = ref<AbortController>(new AbortController());
  const { validationSchema, defaultValues = null, transform } = options;
  const formValues = ref<TSchema['_input']>(
    isRef(defaultValues) ? { ...defaultValues.value } : defaultValues
  );
  const initialValues = ref<TSchema['_input']>(
    isRef(defaultValues) ? { ...defaultValues.value } : defaultValues
  );
  const status = ref<number | null>(null);
  const fetchErrors = ref<Record<string, string> | null>(null);

  const formErrors = reactive<Map<keyof TSchema['_input'], string>>(new Map());
  const errors = computed(() => {
    return Object.fromEntries(formErrors.entries()) as Record<keyof TSchema['_input'], string>;
  });
  const isSubmitting = ref(false);
  const isError = ref(false);
  const isSuccess = ref(false);
  const dirtyValues = reactive<Map<keyof TSchema['_input'], true>>(new Map());
  const isDirty = computed(() => {
    return dirtyValues.size > 0;
  });

  function reset() {
    if (defaultValues) {
      formValues.value = isRef(defaultValues) ? defaultValues.value : defaultValues;
    }
    formErrors.clear();
    isSubmitting.value = false;
    status.value = null;
  }

  function defineField(name: keyof TSchema['_input']) {
    function onInput(e: Event | string | boolean | number) {
      if (formErrors.has(name)) {
        formErrors.delete(name);
      }

      isError.value = false;
      let newValue: any;

      if (e instanceof Event) {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        if (target instanceof HTMLInputElement) {
          switch (target.type) {
            case 'checkbox':
              newValue = target.checked;
              break;
            case 'number':
            case 'range':
              newValue = target.valueAsNumber;
              break;
            case 'date':
            case 'datetime-local':
              newValue = target.valueAsDate;
              break;
            case 'file':
              newValue = target.files;
              break;
            default:
              newValue = target.value;
          }
        } else if (target instanceof HTMLSelectElement) {
          if (target.multiple) {
            newValue = Array.from(target.selectedOptions).map((option) => option.value);
          } else {
            newValue = target.value;
          }
        } else if (target instanceof HTMLTextAreaElement) {
          newValue = target.value;
        }
      } else {
        newValue = e;
      }

      formValues.value[name] = newValue;

      if (!deepEqual(formValues.value[name], initialValues.value[name])) {
        dirtyValues.set(name, true);
      } else {
        dirtyValues.delete(name);
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
    isDirty,
    formValues,
    errors,
    defineField,
    status,
    fetchErrors,
    cancel
  };
}
