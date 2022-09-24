import { FormEventHandler, useCallback } from 'react';

import { Button } from '~/components/elements/button';
import { MarkdownPreviewInput } from '~/components/elements/markdown-preview-input/markdown-preview-input';

type CommentFormProps = {
  autofocus?: boolean;
  placeholder?: string;
  message: string;
  setMessage: (message: string) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSubmit: () => void;
};

export const CommentForm = ({
  autofocus = true,
  placeholder,
  message,
  setMessage,
  canSubmit,
  isSubmitting,
  onCancel,
  onSubmit,
}: CommentFormProps) => {
  const handleSubmit: FormEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit}>
      <MarkdownPreviewInput
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        rows={4}
        name="message"
        placeholder={placeholder ?? 'Rédigez votre message'}
        value={message}
        onChange={setMessage}
      />

      <div className="flex flex-row justify-end gap-2 py-1 px-2">
        {onCancel && (
          <Button secondary onClick={onCancel}>
            Annuler
          </Button>
        )}

        <Button primary type="submit" loading={isSubmitting} disabled={!canSubmit}>
          Envoyer
        </Button>
      </div>
    </form>
  );
};
