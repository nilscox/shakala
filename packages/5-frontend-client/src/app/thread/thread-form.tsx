import { threadActions, ThreadForm as ThreadFormType, ValidationErrors } from 'frontend-domain';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { SubmitButton } from '~/elements/button';
import { FormField } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { MarkdownPreviewInput } from '~/elements/markdown-preview-input/markdown-preview-input';
import { useAppDispatch } from '~/hooks/use-app-dispatch';

export const ThreadForm = () => {
  const dispatch = useAppDispatch();

  const form = useForm<ThreadFormType>({
    defaultValues: {
      text: '',
      description: '',
      keywords: '',
    },
  });

  const { setError } = form;

  const handleSubmit = useCallback(
    async (form: ThreadFormType) => {
      try {
        await dispatch(threadActions.createThread(form));
      } catch (error) {
        if (error instanceof ValidationErrors) {
          for (const field of ['description', 'keywords', 'text']) {
            const message = error.getFieldError(field);

            if (message) {
              setError(field as keyof ThreadFormType, { message });
            }
          }
        }
      }
    },
    [dispatch, setError],
  );

  return (
    <form className="col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormField
        name="description"
        label="Description"
        description="bref résumé du sujet que vous allez aborder"
        error={form.formState.errors.description?.message}
        errorsMap={{
          min: 'La description est trop courte',
          max: 'La description est trop longue',
        }}
      >
        <Input required className="w-full" {...form.register('description')} />
      </FormField>

      <FormField
        name="keywords"
        label="Mots-clés"
        description="liste de mots en lien avec le sujet de cette discussion"
        error={form.formState.errors.keywords?.message}
        errorsMap={{
          min: 'Un des mots-clés est trop court',
          max: 'Un des mots-clés est trop long',
        }}
      >
        <Input className="w-full" {...form.register('keywords')} />
      </FormField>

      <FormField
        name="text"
        label="Texte"
        error={form.formState.errors.text?.message}
        errorsMap={{
          min: 'Le texte est trop court',
          max: 'Le texte est trop long',
        }}
      >
        <MarkdownPreviewInput border rows={8} {...form.register('text')} />
      </FormField>

      <SubmitButton primary className="self-end" loading={form.formState.isSubmitting}>
        Créer
      </SubmitButton>
    </form>
  );
};
