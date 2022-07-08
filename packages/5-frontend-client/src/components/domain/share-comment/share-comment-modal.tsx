import { selectCommentUnsafe } from 'frontend-domain';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '~/components/elements/button';
import { Modal } from '~/components/elements/modal';
import { useSnackbar } from '~/components/elements/snackbar/snackbar';
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

  const showNotImplementedWarning = () => {
    snackbar.warning("Cette fonctionnalité n'est pas encore disponible.");
  };

  const copyPermalink = async () => {
    await window.navigator.clipboard.writeText(permalink);
    snackbar.success('Lien copié');
  };

  return (
    <Modal
      isOpen={commentId !== null}
      onRequestClose={closeModal}
      className="flex flex-col gap-5 max-w-[36rem]"
    >
      <h2 className="text-lg font-bold text-primary">
        Partager le commentaire de <strong className="text-inherit">{comment?.author.nick}</strong>
      </h2>

      <div className="flex flex-row justify-evenly py-4">
        <ShareIcon title="Partager sur Facebook" onClick={showNotImplementedWarning}>
          <img className="w-full" src={facebook} alt="Facebook" />
        </ShareIcon>

        <ShareIcon title="Partager sur Twitter" onClick={showNotImplementedWarning}>
          <img className="w-full" src={twitter} alt="Twitter" />
        </ShareIcon>

        <ShareIcon title="Partager sur LinkedIn" onClick={showNotImplementedWarning}>
          <img className="w-full" src={linkedin} alt="LinkedIn" />
        </ShareIcon>

        <ShareIcon title="Partager un lien" onClick={copyPermalink}>
          <img className="w-full" src={link} alt="Link" />
        </ShareIcon>
      </div>

      <div className="p-2 rounded border">
        <strong className="text-text-light">Permalien</strong>
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
  onClick: () => void;
  children: ReactNode;
};

const ShareIcon = ({ title, onClick, children }: ShareIconProps) => (
  <div
    role="button"
    className="flex justify-center items-center w-8 h-8 cursor-pointer"
    title={title}
    onClick={onClick}
  >
    {children}
  </div>
);
