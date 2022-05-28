import { ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '~/components/elements/button';
import { Modal } from '~/components/elements/modal';
import { useDebounce } from '~/hooks/use-debounce';
import { useRemoveSearchParam, useSearchParam } from '~/hooks/use-search-param';
import facebook from '~/images/logos/facebook-logo.png';
import link from '~/images/logos/link.png';
import linkedin from '~/images/logos/linkedin-logo.png';
import twitter from '~/images/logos/twitter-logo.png';
import { toast } from '~/toast';
import { Comment } from '~/types';

type ShareCommentModalProps = {
  comments: Comment[];
};

export const ShareCommentModal = ({ comments: commentsArray }: ShareCommentModalProps) => {
  const removeSearchParam = useRemoveSearchParam();
  const commentIdParam = useSearchParam('share');
  const commentIdDebounced = useDebounce(commentIdParam, 200);
  const commentId = commentIdParam ?? commentIdDebounced;

  const permalink = usePermalink(commentId as string);

  const comments = useMemo(() => {
    const comments = new Map<string, Comment>();

    const addComment = (comment: Comment) => {
      comments.set(comment.id, comment);
      comment.replies.forEach(addComment);
    };

    commentsArray.forEach(addComment);

    return comments;
  }, [commentsArray]);

  const comment = comments.get(commentId as string);

  const closeModal = () => removeSearchParam('share');

  const showNotImplementedWarning = () => {
    toast.error("Cette fonctionnalité n'est pas encore disponible.");
  };

  const copyPermalink = () => {
    window.navigator.clipboard.writeText(permalink);
    toast.success('Lien copié');
  };

  return (
    <Modal
      isOpen={commentIdParam !== null}
      onRequestClose={closeModal}
      className="flex flex-col gap-5 max-w-[36rem]"
    >
      <h2 className="text-lg font-bold text-primary">
        Partager le commentaire de <strong>{comment?.author.nick}</strong>
      </h2>

      <div className="flex flex-row justify-evenly">
        <ShareIcon title="Partager sur Facebook" onClick={showNotImplementedWarning}>
          <img className="w-5" src={facebook} alt="Facebook" />
        </ShareIcon>

        <ShareIcon title="Partager sur Twitter" onClick={showNotImplementedWarning}>
          <img className="w-5" src={twitter} alt="Twitter" />
        </ShareIcon>

        <ShareIcon title="Partager sur LinkedIn" onClick={showNotImplementedWarning}>
          <img className="w-5" src={linkedin} alt="LinkedIn" />
        </ShareIcon>

        <ShareIcon title="Partager un lien" onClick={copyPermalink}>
          <img className="w-5" src={link} alt="Link" />
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
    className="flex justify-center items-center w-8 h-8 rounded-full border cursor-pointer"
    title={title}
    onClick={onClick}
  >
    {children}
  </div>
);
