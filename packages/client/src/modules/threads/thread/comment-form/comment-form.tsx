import { useForm } from 'react-hook-form';

import { TOKENS } from '~/app/tokens';
import { Button, SubmitButton } from '~/elements/button';
import { FieldError } from '~/elements/form-field';
import { MarkdownPreviewInput } from '~/elements/markdown-preview-input';
import { useRouteParam } from '~/hooks/use-route-params';
import { useSubmit } from '~/hooks/use-submit';
import { getQueryKey } from '~/utils/query-key';

export type CommentForm = {
  text: string;
};

type CommentFormProps = {
  autofocus?: boolean;
  placeholder?: string;
  initialText: string;
  onCancel?: () => void;
  onSubmit: (text: string) => Promise<string>;
  onSubmitted?: (commentId: string) => void;
};

export const CommentForm = ({
  autofocus = true,
  placeholder,
  initialText,
  onCancel,
  onSubmit,
  onSubmitted,
}: CommentFormProps) => {
  const threadId = useRouteParam('threadId');

  const form = useForm<CommentForm>({
    defaultValues: {
      text: initialText,
    },
  });

  const handleSubmit = useSubmit(form, async ({ text }) => onSubmit(text), {
    invalidate: getQueryKey(TOKENS.thread, 'getThread', threadId),
    onSuccess: (commentId) => {
      form.setValue('text', '');
      onSubmitted?.(commentId);
    },
  });

  const error = form.formState.errors.text;

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <MarkdownPreviewInput
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        rows={4}
        placeholder={placeholder ?? 'Rédigez votre message'}
        {...form.register('text')}
      />

      <div className="flex flex-row items-center justify-end gap-2 py-1 px-2">
        {error?.message && (
          <FieldError
            className="mr-auto"
            error={error.message}
            errorsMap={{
              min: "Le message n'est pas suffisamment long",
              max: 'Le message est trop long (maximum : 20 000 caractères)',
            }}
          />
        )}

        {onCancel && (
          <Button secondary onClick={onCancel}>
            Annuler
          </Button>
        )}

        <SubmitButton primary loading={form.formState.isSubmitting}>
          Envoyer
        </SubmitButton>
      </div>
    </form>
  );
};
