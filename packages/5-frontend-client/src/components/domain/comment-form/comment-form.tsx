import clsx from 'clsx';
import { createRootComment, selectCreateCommentText } from 'frontend-domain';
import { setCreateCommentText } from 'frontend-domain/src/thread/thread.actions';
import { FormEventHandler, useCallback, useState } from 'react';

import { Button } from '~/components/elements/button';
import { Markdown } from '~/components/elements/markdown';
import { TextAreaAutoResize } from '~/components/elements/textarea-autoresize';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { Tab, Tabs } from './tabs';

type RealCommentFormProps = {
  autofocus?: boolean;
  placeholder?: string;
  threadId: string;
  commentId?: string;
  parentId?: string;
  initialText?: string;
  onCancel?: () => void;
};

export const RealCommentForm = ({
  autofocus = true,
  placeholder,
  threadId,
  commentId,
  initialText,
  onCancel,
}: RealCommentFormProps) => {
  const [tab, setTab] = useState(Tab.edit);

  const dispatch = useDispatch();
  const message = useSelector(selectCreateCommentText, threadId);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);

      dispatch(createRootComment(threadId, String(form.get('message'))));
    },
    [threadId, dispatch],
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
        onChange={(e) => dispatch(setCreateCommentText(threadId, e.currentTarget.value))}
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

