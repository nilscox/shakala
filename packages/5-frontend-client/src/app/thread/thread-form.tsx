import { threadActions, ThreadForm as ThreadFormType } from 'frontend-domain';
import { useForm } from 'react-hook-form';

import { SubmitButton } from '~/elements/button';
import { FormField } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { MarkdownPreviewInput } from '~/elements/markdown-preview-input/markdown-preview-input';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useFormSubmit } from '~/hooks/use-form-submit';

export const ThreadForm = () => {
  const dispatch = useAppDispatch();

  const form = useForm<ThreadFormType>({
    defaultValues: {
      text: '',
      description: '',
      keywords: '',
    },
  });

  const handleSubmit = useFormSubmit((data) => dispatch(threadActions.createThread(data)), form.setError);

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
