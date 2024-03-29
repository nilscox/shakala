import { useInjection } from 'brandi-react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import { ThreadFormFields } from '~/adapters/api/thread/thread.port';
import { TOKENS } from '~/app/tokens';
import { Button, SubmitButton } from '~/elements/button';
import { FormField } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { useSnackbar } from '~/elements/snackbar';
import { useSubmit } from '~/hooks/use-submit';

type ThreadFormProps = {
  initialValues?: ThreadFormFields;
  submitButtonText: string;
  onCancel?: () => void;
  onSubmit: (values: ThreadFormFields) => Promise<string>;
  onSubmitted?: (threadId: string) => void;
};

export const ThreadForm = ({
  initialValues,
  submitButtonText,
  onCancel,
  onSubmit,
  onSubmitted,
}: ThreadFormProps) => {
  const snackbar = useSnackbar();

  const form = useForm<ThreadFormFields>({
    defaultValues: initialValues ?? {
      description: '',
      keywords: '',
      text: '',
    },
  });

  const handleSubmit = useSubmit(form, onSubmit, {
    onSuccess: onSubmitted,
    onError: (error) => {
      // todo: test
      if (error.message === 'UserMustBeAuthorError') {
        snackbar.error("Vous devez être l'auteur du fil de discussion pour pouvoir l'éditer.");
      } else {
        throw error;
      }
    },
  });

  const { useEditor, Editor, Toolbar } = useInjection(TOKENS.richTextEditor);

  const { editor } = useEditor({
    initialHtml: form.getValues('text'),
    autofocus: false,
    onChange: (text) => {
      form.setValue('text', text);
      form.clearErrors('text');
    },
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
        <Input required className="w-full max-w-4" {...form.register('description')} />
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
        <Input className="w-full max-w-4" {...form.register('keywords')} />
      </FormField>

      <FormField
        name="text"
        label={
          <div className="row">
            Texte <Toolbar className="mb-0.5 ml-auto" editor={editor} />
          </div>
        }
        error={form.formState.errors.text?.message}
        errorsMap={{
          min: 'Le texte est trop court',
          max: 'Le texte est trop long',
        }}
      >
        <Editor
          editor={editor}
          className="min-h-2 w-full rounded border bg-neutral p-1 focus-within:border-primary"
        />
      </FormField>

      <div className="row justify-end gap-4">
        <Button secondary onClick={onCancel} className={clsx(!onCancel && 'hidden')}>
          Annuler
        </Button>
        <SubmitButton primary loading={form.formState.isSubmitting}>
          {submitButtonText}
        </SubmitButton>
      </div>
    </form>
  );
};
