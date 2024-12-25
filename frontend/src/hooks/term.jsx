import { useForm } from "@mantine/form";

function useTermForm(term) {
  return useForm({
    initialValues: {
      ...term,
      status: String(term.status),
    },
    enhanceGetInputProps: ({ form, field }) => {
      if (field === "syncStatus") {
        const parentsCount = form.getValues().parents.length;

        if (!parentsCount || parentsCount > 1)
          return {
            disabled: true,
            checked: false,
          };

        return { disabled: false, checked: form.getValues().syncStatus };
      }
    },
  });
}

export { useTermForm };
