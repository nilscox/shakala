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

      <div className="flex flex-row gap-2 justify-end py-1 px-2">
        {onCancel && (
          <Button secondary type="button" onClick={onCancel}>
            Annuler
          </Button>
        )}

        <Button primary loading={isSubmitting} disabled={!canSubmit}>
          Envoyer
        </Button>
      </div>
    </form>
  );
};
