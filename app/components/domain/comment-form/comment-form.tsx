import { Form } from '@remix-run/react';
import classNames from 'classnames';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';

import { Tab, Tabs } from './tabs';

type RealCommentFormProps = {
  onCancel: () => void;
};

export const RealCommentForm = ({ onCancel }: RealCommentFormProps) => {
  const [tab, setTab] = useState<Tab>(Tab.edit);
  const [message, setMessage] = useState('');

  return (
    <Form>
      <Tabs tab={tab} setTab={setTab} />

      <textarea
        autoFocus
        rows={4}
        className={classNames(
          'block p-1 w-full rounded border-none focus-visible:outline-none',
          tab !== Tab.edit && 'hidden',
        )}
        placeholder="Rédigez votre message"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />

      <Markdown
        markdown={message}
        className={classNames('min-h-[80px] bg-white p-1', tab !== Tab.preview && 'hidden')}
      />

      <div className="flex flex-row gap-2 justify-end py-1 px-2 border-t border-light-gray">
        <button className="button-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button disabled={message === ''} className="button-primary">
          Envoyer
        </button>
      </div>
    </Form>
  );
};
