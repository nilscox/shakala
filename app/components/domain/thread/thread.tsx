import { useSearchParams } from 'react-router-dom';

import { AvatarNick } from '~/components/domain/avatar/avatar-nick';
import { Date } from '~/components/elements/date';
import { Fallback } from '~/components/elements/fallback';
import { Markdown } from '~/components/elements/markdown';
import { Thread as ThreadType } from '~/types';
import { useUser } from '~/user.provider';

import { RealCommentForm } from '../comment-form/comment-form';
import { Comment } from '../comment/comment';
import { ShareCommentModal } from '../share-comment/share-comment-modal';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  thread: ThreadType;
};

export const Thread = ({ thread }: ThreadProps) => (
  <>
    <div className="my-5 md:my-8">
      <div className="flex flex-col gap-2 justify-between items-start mb-2 xs:flex-row xs:items-center">
        <AvatarNick big {...thread.author} />
        <div className="text-text-light">
          <Date date={thread.date} format="'Le' d MMMM yyyy" />, {thread.comments.length} commentaires
        </div>
      </div>

      <Markdown markdown={thread.text} className="p-2 xs:p-4 card" />
    </div>

    <ThreadFilters className="my-4" />

    {thread.comments.length === 0 && <NoCommentFallback />}
    <CommentsList thread={thread} />

    <ShareCommentModal comments={thread.comments} />
  </>
);

export type CommentsListProps = {
  thread: ThreadType;
};

export const CommentsList = ({ thread }: CommentsListProps) => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      {thread.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <div className="card">
        <div className="flex flex-row gap-4 items-center p-2 pb-0">
          <AvatarNick image={user?.profileImage} nick={user?.nick ?? 'Moi'} />
        </div>
        <RealCommentForm autofocus={false} placeholder={`Répondre à ${thread.author.nick}`} />
      </div>
    </div>
  );
};

const NoCommentFallback = () => {
  const [params] = useSearchParams();
  const search = params.get('search');

  if (search) {
    return <Fallback>Aucun commentaire n'a été trouvé pour cette recherche.</Fallback>;
  }

  return <Fallback>Aucun commentaire n'a été publié pour le moment.</Fallback>;
};
