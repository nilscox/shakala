import clsx from 'clsx';
import { FormEventHandler, useCallback, useState } from 'react';

import { Button } from '~/components/elements/button';
import { Markdown } from '~/components/elements/markdown';
import { TextAreaAutoResize } from '~/components/elements/textarea-autoresize';

import { Tab, Tabs } from './tabs';

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
  const [tab, setTab] = useState(Tab.edit);

  const handleSubmit = useCallback<FormEventHandler>(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Tabs tab={tab} setTab={setTab} />

      <TextAreaAutoResize
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        rows={4}
        name="message"
        placeholder={placeholder ?? 'Rédigez votre message'}
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        className={clsx(
          'block p-1 w-full rounded border-none focus-visible:outline-none',
          tab !== Tab.edit && 'hidden',
        )}
      />

      <Markdown
        markdown={message}
        className={clsx('p-1 min-h-markdown-preview bg-neutral', tab !== Tab.preview && 'hidden')}
      />

      <div className="flex flex-row gap-2 justify-end py-1 px-2 border-t">
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
