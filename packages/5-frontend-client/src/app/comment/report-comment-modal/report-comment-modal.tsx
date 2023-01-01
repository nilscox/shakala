import { commentActions, commentSelectors } from '@shakala/frontend-domain';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { PageTitle } from '~/app/page-title';
import { Button, SubmitButton } from '~/elements/button';
import { Link } from '~/elements/link';
import { Markdown } from '~/elements/markdown';
import { Modal } from '~/elements/modal';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useFormSubmit } from '~/hooks/use-form-submit';
import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';

export const ReportCommentModal = () => {
  const commentId = useSearchParam('report') as string;
  const comment = useAppSelector(commentSelectors.byId.unsafe, commentId);

  const [requestClose, setRequestClose] = useState(false);
  const setSearchParam = useSetSearchParam();

  const handleClose = () => {
    setRequestClose(true);

    setTimeout(() => {
      setRequestClose(false);
      setSearchParam('report', undefined);
    }, 200);
  };

  return (
    <Modal
      isOpen={!requestClose && Boolean(comment)}
      className="max-h-full max-w-4"
      onRequestClose={handleClose}
    >
      {comment && <ReportComment commentId={comment.id} onClose={handleClose} />}
    </Modal>
  );
};

type ReportCommentProps = {
  commentId: string;
  onClose: () => void;
};

const ReportComment = ({ commentId, onClose }: ReportCommentProps) => {
  const dispatch = useAppDispatch();
  const comment = useAppSelector(commentSelectors.byId, commentId);

  const form = useForm({
    defaultValues: {
      reason: '',
    },
  });

  const handleSubmit = useFormSubmit(
    (data) => dispatch(commentActions.reportComment(data.reason)),
    form.setError,
  );

  return (
    <>
      <PageTitle>{`Signaler le commentaire de ${comment.author.nick}`}</PageTitle>

      <h2 className="mb-4 py-0 text-primary">
        Signaler le commentaire de <strong className="text-primary">{comment.author.nick}</strong>
      </h2>

      <p>Vous êtes sur le point de signaler un commentaire.</p>

      <p className="text-sm text-muted">
        Il est important de signaler les commentaires qui ne respectent pas{' '}
        <Link href="/charte">la charte</Link> : cela en informera les modérateurs qui pourront réagir en
        fonction de la situation.
      </p>

      <Markdown markdown={comment.text} className="my-5 border-l-4 border-warning pl-2" />

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <textarea
          placeholder="Précisez le motif du signalement si nécessaire"
          rows={2}
          className="my-2 w-full rounded border p-1"
          {...form.register('reason')}
        />

        <div className="row justify-end gap-2">
          <Button secondary onClick={onClose}>
            Annuler
          </Button>

          <SubmitButton primary loading={form.formState.isSubmitting}>
            Signaler
          </SubmitButton>
        </div>
      </form>
    </>
  );
};
