import { Form, useParams, useTransition } from '@remix-run/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { Button } from '~/components/elements/button';
import { Markdown } from '~/components/elements/markdown';

import { Tab, Tabs } from './tabs';

type RealCommentFormProps = {
  parentId?: string;
  onCancel: () => void;
  onSubmitted: () => void;
};

export const RealCommentForm = ({ parentId, onCancel, onSubmitted }: RealCommentFormProps) => {
  const { threadId } = useParams();
  const [tab, setTab] = useState<Tab>(Tab.edit);
  const [message, setMessage] = useState('');

  const transition = useTransition();

  useEffect(() => {
    if (transition.state === 'loading' && transition.type === 'actionReload') {
      onSubmitted();
    }
  }, [transition, onSubmitted]);

  return (
    <Form method="post">
      <Tabs tab={tab} setTab={setTab} />

      <input type="hidden" name="threadId" value={threadId as string} />
      <input type="hidden" name="parentId" value={parentId} />

      <textarea
        autoFocus
        rows={4}
        name="message"
        placeholder="Rédigez votre message"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        className={classNames(
          'block p-1 w-full rounded border-none focus-visible:outline-none',
          tab !== Tab.edit && 'hidden',
        )}
      />

      <Markdown
        markdown={message}
        className={classNames('min-h-[80px] bg-white p-1', tab !== Tab.preview && 'hidden')}
      />

      <div className="flex flex-row gap-2 justify-end py-1 px-2 border-t border-light-gray">
        <button className="button-secondary" onClick={onCancel}>
          Annuler
        </button>
        <Button primary loading={transition.state === 'submitting'} disabled={message === ''}>
          Envoyer
        </Button>
      </div>
    </Form>
  );
};
