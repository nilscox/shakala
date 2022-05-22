import { Form, useParams, useTransition } from '@remix-run/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

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
  onSubmitted?: () => void;
};

export const RealCommentForm = ({
  autofocus = true,
  placeholder,
  commentId,
  parentId,
  initialText,
  onCancel,
  onSubmitted,
}: RealCommentFormProps) => {
  const { threadId } = useParams();
  const [tab, setTab] = useState<Tab>(Tab.edit);
  const [message, setMessage] = useState(initialText ?? '');

  const transition = useTransition();

  useEffect(() => {
    if (transition.state === 'loading' && transition.type === 'actionReload') {
      setMessage('');
      onSubmitted?.();
    }
  }, [transition, onSubmitted]);

  return (
    <Form method={commentId ? 'put' : 'post'}>
      <Tabs tab={tab} setTab={setTab} />

      <input type="hidden" name="threadId" value={threadId as string} />
      <input type="hidden" name="commentId" value={commentId} />
      <input type="hidden" name="parentId" value={parentId} />

      <TextAreaAutoResize
        autoFocus={autofocus}
        rows={4}
        name="message"
        placeholder={placeholder ?? 'Rédigez votre message'}
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        className={classNames(
          'block p-1 w-full rounded border-none focus-visible:outline-none',
          tab !== Tab.edit && 'hidden',
        )}
      />

      <Markdown
        markdown={message}
        className={classNames('min-h bg-white p-1', tab !== Tab.preview && 'hidden')}
      />

      <div className="flex flex-row gap-2 justify-end py-1 px-2 border-t">
        {onCancel && (
          <button className="button-secondary" onClick={onCancel}>
            Annuler
          </button>
        )}
        <Button primary loading={transition.state === 'submitting'} disabled={message === ''}>
          Envoyer
        </Button>
      </div>
    </Form>
  );
};
