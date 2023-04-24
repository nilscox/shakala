import { CommentDto } from '@shakala/shared';
import { ReactNode } from 'react';

import { PageTitle } from '~/app/page-title';
import { Button } from '~/elements/button';
import { Modal, useModalState } from '~/elements/modal';
import { useSnackbar } from '~/elements/snackbar';
import { useRouteParam } from '~/hooks/use-route-params';
import { useSearchParam } from '~/hooks/use-search-params';
import facebook from '~/images/logos/facebook-logo.png';
import link from '~/images/logos/link.png';
import linkedin from '~/images/logos/linkedin-logo.png';
import twitter from '~/images/logos/twitter-logo.png';

import { FetchComment } from './fetch-comment';

export const ShareCommentModal = () => {
  const [commentId, setShareCommentId] = useSearchParam('share');
  const { isOpen, closeModal } = useModalState(commentId);

  return (
    <Modal
      isOpen={isOpen}
      className="flex max-w-4 flex-col gap-5"
      onRequestClose={closeModal}
      onAfterClose={() => setShareCommentId(undefined)}
    >
      {commentId && (
        <FetchComment commentId={commentId} onNotFound={closeModal}>
          {(comment) => <ShareComment comment={comment} />}
        </FetchComment>
      )}

      <Button className="button-secondary self-end" onClick={closeModal}>
        Fermer
      </Button>
    </Modal>
  );
};

type ShareCommentProps = {
  comment: CommentDto;
};

const ShareComment = ({ comment }: ShareCommentProps) => {
  const snackbar = useSnackbar();

  const permalink = usePermalink(comment.id);
  const copyPermalink = async () => {
    await window.navigator.clipboard.writeText(permalink);
    snackbar.success('Lien copié');
  };

  return (
    <>
      <PageTitle>{`Partager le commentaire de ${comment.author.nick}`}</PageTitle>

      <h2 className="py-0 text-primary">
        Partager le commentaire de <strong className="text-inherit">{comment.author.nick}</strong>
      </h2>

      <div className="flex flex-row justify-evenly py-4">
        <ShareIcon
          title="Partager sur Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: permalink })}`}
        >
          <img src={facebook} alt="Facebook" className="w-full" />
        </ShareIcon>

        <ShareIcon
          title="Partager sur Twitter"
          href={`https://twitter.com/intent/tweet?${new URLSearchParams({
            text: `Venez découvrir ce que dit ${comment.author.nick} sur #shakala !\n${permalink}`,
          })}`}
        >
          <img src={twitter} alt="Twitter" className="w-full" />
        </ShareIcon>

        <ShareIcon
          title="Partager sur LinkedIn"
          href={`https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: permalink })}`}
        >
          <img src={linkedin} alt="LinkedIn" className="w-full" />
        </ShareIcon>

        <ShareIcon title="Partager un lien" onClick={void copyPermalink}>
          <img src={link} alt="Link" className="w-full" />
        </ShareIcon>
      </div>

      <div className="rounded border p-2">
        <strong className="text-muted">Permalien</strong>
        <a className="block break-all" href={permalink}>
          {permalink}
        </a>
      </div>
    </>
  );
};

const usePermalink = (commentId: string) => {
  const threadId = useRouteParam('threadId');

  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);

  return `${url.protocol}//${url.host}/discussions/${threadId}#${commentId}`;
};

type ShareIconProps = {
  title: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
};

const ShareIcon = ({ title, href = '#', onClick, children }: ShareIconProps) => (
  <a
    className="flex h-8 w-8 cursor-pointer items-center justify-center"
    href={href}
    title={title}
    onClick={onClick}
    target={href !== '#' ? '_blank' : undefined}
    rel="noreferrer"
  >
    {children}
  </a>
);
