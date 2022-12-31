import { commentSelectors } from '@shakala/frontend-domain';
import { ReactNode } from 'react';

import { PageTitle } from '~/app/page-title';
import { Button } from '~/elements/button';
import { Modal } from '~/elements/modal';
import { useSnackbar } from '~/elements/snackbar';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useParams } from '~/hooks/use-params';
import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';
import facebook from '~/images/logos/facebook-logo.png';
import link from '~/images/logos/link.png';
import linkedin from '~/images/logos/linkedin-logo.png';
import twitter from '~/images/logos/twitter-logo.png';

export const ShareCommentModal = () => {
  const snackbar = useSnackbar();

  const commentId = useSearchParam('share');
  const setSearchParam = useSetSearchParam();
  const permalink = usePermalink(commentId as string);

  const comment = useAppSelector(commentSelectors.byId.unsafe, commentId as string);

  const closeModal = () => {
    setSearchParam('share', undefined);
  };

  const copyPermalink = async () => {
    await window.navigator.clipboard.writeText(permalink);
    snackbar.success('Lien copié');
  };

  return (
    <Modal
      isOpen={commentId !== undefined}
      onRequestClose={closeModal}
      className="flex max-w-4 flex-col gap-5"
    >
      <PageTitle>{`Partager le commentaire de ${comment?.author.nick}`}</PageTitle>

      <h2 className="py-0 text-primary">
        Partager le commentaire de <strong className="text-inherit">{comment?.author.nick}</strong>
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
            text: `Venez découvrir ce que dit ${comment?.author.nick} sur #shakala !\n${permalink}`,
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

        <ShareIcon title="Partager un lien" onClick={copyPermalink}>
          <img src={link} alt="Link" className="w-full" />
        </ShareIcon>
      </div>

      <div className="rounded border p-2">
        <strong className="text-muted">Permalien</strong>
        <a className="block break-all" href={permalink}>
          {permalink}
        </a>
      </div>

      <Button className="button-secondary self-end" onClick={closeModal}>
        Fermer
      </Button>
    </Modal>
  );
};

const usePermalink = (commentId: string) => {
  const { 'thread-id': threadId } = useParams();

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
