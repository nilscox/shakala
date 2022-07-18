import {
  Comment as CommentType,
  selectFormattedThreadDate,
  selectLoadingComments,
  selectLoadingCommentsError,
  selectThread,
  selectThreadComments,
  User,
} from 'frontend-domain';
import { useSearchParams } from 'react-router-dom';

import { AsyncResource } from '~/components/elements/async-resource/async-resource';
import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Fallback } from '~/components/elements/fallback';
import { Markdown } from '~/components/elements/markdown';
import { useSelector } from '~/hooks/use-selector';
import { useUser } from '~/hooks/use-user';

import { RootCommentForm } from '../comment-form';
import { Comment } from '../comment/comment';
import { ShareCommentModal } from '../share-comment/share-comment-modal';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  threadId: string;
};

export const Thread = ({ threadId }: ThreadProps) => {
  const thread = useSelector(selectThread, threadId);

  const loadingComments = useSelector(selectLoadingComments, threadId);
  const loadingCommentsError = useSelector(selectLoadingCommentsError, threadId);
  const comments = useSelector(selectThreadComments, threadId);

  const dateFormatted = useSelector(selectFormattedThreadDate, threadId);

  const renderComments = (comments: CommentType[]) => (
    <>
      {comments.length === 0 && <NoCommentFallback />}
      <CommentsList threadId={threadId} author={thread.author} comments={comments} />
    </>
  );

  return (
    <>
      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className="my-5 md:my-[4rem]">
        <div className="flex-wrap gap-4 justify-between items-center mb-2 row">
          <AvatarNick big {...thread.author} />
          <div className="text-muted">
            <time dateTime={thread.date}>{dateFormatted}</time>, {comments?.length ?? '?'} commentaires
          </div>
        </div>

        <Markdown markdown={thread.text} className="p-4 sm:p-5 card" />
      </div>

      <ThreadFilters threadId={threadId} className="my-4" />

      <AsyncResource
        data={comments}
        loading={loadingComments}
        error={loadingCommentsError}
        render={renderComments}
      />

      <ShareCommentModal />
    </>
  );
};

type CommentsListProps = {
  threadId: string;
  author: User;
  comments: CommentType[];
};

const CommentsList = ({ threadId, author, comments }: CommentsListProps) => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      {comments.map(({ id }) => (
        <Comment key={id} commentId={id} />
      ))}

      <div className="card">
        <div className="flex flex-row gap-4 items-center p-2 pb-0">
          <AvatarNick image={user?.profileImage} nick={user?.nick ?? 'Moi'} />
        </div>

        <RootCommentForm threadId={threadId} author={author} />
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
