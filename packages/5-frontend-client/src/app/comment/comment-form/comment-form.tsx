import { ValidationErrors } from 'frontend-domain';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '~/elements/button';
import { FieldError } from '~/elements/form-field';
import { MarkdownPreviewInput } from '~/elements/markdown-preview-input';

export type CommentForm = {
  text: string;
};

type CommentFormProps = {
  autofocus?: boolean;
  placeholder?: string;
  initialText: string;
  canSubmit: boolean;
  onTextChange?: (text: string) => void;
  onCancel?: () => void;
  onSubmit: (data: CommentForm) => Promise<boolean>;
};

export const CommentForm = ({
  autofocus = true,
  placeholder,
  initialText,
  canSubmit,
  onTextChange,
  onCancel,
  onSubmit,
}: CommentFormProps) => {
  const form = useForm<CommentForm>({
    defaultValues: {
      text: initialText,
    },
  });

  const handleChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      onTextChange?.(event.currentTarget.value);
    },
    [onTextChange],
  );

  const { setError, setValue } = form;

  const handleSubmit = useCallback(
    async (data: CommentForm) => {
      try {
        if (await onSubmit(data)) {
          setValue('text', '');
        }
      } catch (error) {
        if (error instanceof ValidationErrors) {
          const message = error.getFieldError('text');

          if (typeof message === 'string') {
            setError('text', { message });
          }
        }
      }
    },
    [onSubmit, setError, setValue],
  );

  const error = form.formState.errors.text;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <MarkdownPreviewInput
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        rows={4}
        placeholder={placeholder ?? 'Rédigez votre message'}
        {...form.register('text', { onChange: handleChange })}
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

        <Button primary type="submit" loading={form.formState.isSubmitting} disabled={!canSubmit}>
          Envoyer
        </Button>
      </div>
    </form>
  );
};
