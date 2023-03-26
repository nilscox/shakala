import { useForm } from 'react-hook-form';
import { navigate } from 'vite-plugin-ssr/client/router';

import { ThreadFormFields } from '../../adapters/api/thread/thread.port';
import { di } from '../../di';
import { SubmitButton } from '../../elements/button';
import { FormField } from '../../elements/form-field';
import { Input } from '../../elements/input';
import { useSubmit } from '../../hooks/use-submit';

export const ThreadForm = () => {
  const form = useForm<ThreadFormFields>({
    defaultValues: {
      text: '',
      description: '',
      keywords: '',
    },
  });

  const handleSubmit = useSubmit(form, (data) => di.thread.createThread(data), {
    onSuccess: (threadId) => void navigate(`/discussions/${threadId}`),
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
        <textarea rows={8} {...form.register('text')} />
      </FormField>

      <SubmitButton primary className="self-end" loading={form.formState.isSubmitting}>
        Créer
      </SubmitButton>
    </form>
  );
};
