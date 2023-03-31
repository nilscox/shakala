import { CommentDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import { useForm } from 'react-hook-form';

import { PageTitle } from '~/app/page-title';
import { Button, SubmitButton } from '~/elements/button';
import { Link } from '~/elements/link';
import { Modal, useModalState } from '~/elements/modal';
import { useSnackbar } from '~/elements/snackbar';
import { useSearchParam } from '~/hooks/use-search-params';
import { useSubmit } from '~/hooks/use-submit';

import { FetchComment } from '../fetch-comment';

export const ReportCommentModal = () => {
  const [commentId, setReportCommentId] = useSearchParam('signaler');
  const { isOpen, closeModal } = useModalState(commentId);

  return (
    <Modal
      isOpen={isOpen}
      className="max-h-full max-w-4"
      onRequestClose={closeModal}
      onAfterClose={() => setReportCommentId(undefined)}
    >
      {commentId && (
        <FetchComment commentId={commentId} onNotFound={closeModal}>
          {(comment) => <ReportComment comment={comment} onClose={closeModal} />}
        </FetchComment>
      )}
    </Modal>
  );
};

type ReportCommentProps = {
  comment: CommentDto;
  onClose: () => void;
};

const ReportComment = ({ comment, onClose }: ReportCommentProps) => {
  const snackbar = useSnackbar();

  const form = useForm({
    defaultValues: {
      reason: '',
    },
  });

  const commentAdapter = useInjection(TOKENS.comment);
  const handleSubmit = useSubmit(
    form,
    async ({ reason }) => {
      if (reason) {
        await commentAdapter.reportComment(comment.id, reason);
      } else {
        await commentAdapter.reportComment(comment.id);
      }
    },
    {
      onSuccess: () => {
        onClose();
        snackbar.success('Le signalement a bien été enregistré. Merci pour votre contribution !');
      },
    }
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

      {/* <Markdown markdown={comment.text} className="my-5 border-l-4 border-warning pl-2" /> */}
      <div className="my-5 border-l-4 border-warning pl-2">{comment.text}</div>

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
