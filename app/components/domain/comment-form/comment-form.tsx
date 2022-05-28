import { useFetcher, useParams } from '@remix-run/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { Button } from '~/components/elements/button';
import { Markdown } from '~/components/elements/markdown';
import { TextAreaAutoResize } from '~/components/elements/textarea-autoresize';
import { toast } from '~/toast';

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

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === 'done') {
      if (fetcher.data?.ok) {
        setMessage('');
        onSubmitted?.();
      } else {
        handleError(fetcher.data);
      }
    }
  }, [fetcher, onSubmitted]);

  return (
    <fetcher.Form method={commentId ? 'put' : 'post'}>
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

        <Button primary loading={fetcher.state === 'submitting'} disabled={message === ''}>
          Envoyer
        </Button>
      </div>
    </fetcher.Form>
  );
};

const handleError = (data: any) => {
  if (data?.error === 'UserMustBeAuthorError') {
    toast.error("Vous devez être l'auteur du message pour pouvoir l'éditer");
  } else if (data?.error === 'ValidationError' && data?.message?.includes('minLength')) {
    toast.error('Votre message est trop court.', { duration: 10000000, style: {} });
  } else {
    toast.error("Quelque chose s'est mal passé, veuillez réessayer plus tard");
  }
};
