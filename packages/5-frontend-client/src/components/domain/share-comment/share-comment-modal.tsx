import { selectCommentUnsafe } from 'frontend-domain';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '~/components/elements/button';
import { Modal } from '~/components/elements/modal';
import { useSnackbar } from '~/components/elements/snackbar';
import { PageTitle } from '~/components/layout/page-title';
import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';
import { useSelector } from '~/hooks/use-selector';
import facebook from '~/images/logos/facebook-logo.png';
import link from '~/images/logos/link.png';
import linkedin from '~/images/logos/linkedin-logo.png';
import twitter from '~/images/logos/twitter-logo.png';

export const ShareCommentModal = () => {
  const snackbar = useSnackbar();

  const commentId = useSearchParam('share');
  const setSearchParam = useSetSearchParam();
  const permalink = usePermalink(commentId as string);

  const comment = useSelector(selectCommentUnsafe, commentId ?? '');

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
      // eslint-disable-next-line tailwindcss/no-arbitrary-value
      className="flex flex-col gap-5 max-w-[36rem]"
    >
      <PageTitle>{`Partager le commentaire de ${comment?.author.nick}`}</PageTitle>

      <h2 className="text-lg font-bold text-primary">
        Partager le commentaire de <strong className="text-inherit">{comment?.author.nick}</strong>
      </h2>

      <div className="flex flex-row justify-evenly py-4">
        <ShareIcon
          title="Partager sur Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: permalink })}`}
        >
          <img className="w-full" src={facebook} alt="Facebook" />
        </ShareIcon>

        <ShareIcon
          title="Partager sur Twitter"
          href={`https://twitter.com/intent/tweet?${new URLSearchParams({
            text: `Venez découvrir ce que dit ${comment?.author.nick} sur #shakala !\n${permalink}`,
          })}`}
        >
          <img className="w-full" src={twitter} alt="Twitter" />
        </ShareIcon>

        <ShareIcon
          title="Partager sur LinkedIn"
          href={`https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: permalink })}`}
        >
          <img className="w-full" src={linkedin} alt="LinkedIn" />
        </ShareIcon>

        <ShareIcon title="Partager un lien" onClick={copyPermalink}>
          <img className="w-full" src={link} alt="Link" />
        </ShareIcon>
      </div>

      <div className="p-2 rounded border">
        <strong className="text-muted">Permalien</strong>
        <a className="block break-all" href={permalink}>
          {permalink}
        </a>
      </div>

      <Button className="self-end button-secondary" onClick={closeModal}>
        Fermer
      </Button>
    </Modal>
  );
};

const usePermalink = (commentId: string) => {
  const { threadId } = useParams();

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
    className="flex justify-center items-center w-8 h-8 cursor-pointer"
    href={href}
    title={title}
    onClick={onClick}
    target={href !== '#' ? '_blank' : undefined}
    rel="noreferrer"
  >
    {children}
  </a>
);
