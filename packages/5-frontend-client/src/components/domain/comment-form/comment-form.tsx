import clsx from 'clsx';
import { FormEventHandler, useCallback, useState } from 'react';

import { Button } from '~/components/elements/button';
import { Markdown } from '~/components/elements/markdown';
import { TextAreaAutoResize } from '~/components/elements/textarea-autoresize';

import { Tab, Tabs } from './tabs';

type RealCommentFormProps = {
  autofocus?: boolean;
  placeholder?: string;
  commentId?: string;
  parentId?: string;
  initialText?: string;
  onCancel?: () => void;
};

export const RealCommentForm = ({
  autofocus = true,
  placeholder,
  commentId,
  initialText,
  onCancel,
}: RealCommentFormProps) => {
  const [tab, setTab] = useState(Tab.edit);
  const [message, setMessage] = useState(initialText ?? '');

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
    event.preventDefault();
  }, []);

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
          <button className="button-secondary" onClick={onCancel}>
            Annuler
          </button>
        )}

        <Button primary loading={false} disabled={message === ''}>
          Envoyer
        </Button>
      </div>
    </form>
  );
};

