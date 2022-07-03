import {
  Comment as CommentType,
  createRootComment,
  selectRootCommentFormText,
  selectLoadingComments,
  selectLoadingCommentsError,
  selectThread,
  selectThreadComments,
  User,
  selectCanSubmitRootComment,
  selectIsSubmittingRootComment,
} from 'frontend-domain';
import { setCreateRootCommentText } from 'frontend-domain/src/thread/thread.actions';
import { useSearchParams } from 'react-router-dom';

import { AsyncResource } from '~/async-resource';
import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Date } from '~/components/elements/date';
import { Fallback } from '~/components/elements/fallback';
import { Markdown } from '~/components/elements/markdown';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';
import { useUser } from '~/hooks/use-user';

import { CommentForm } from '../comment-form';
import { Comment } from '../comment/comment';

// import { ShareCommentModal } from '../share-comment/share-comment-modal';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  threadId: string;
};

export const Thread = ({ threadId }: ThreadProps) => {
  const thread = useSelector(selectThread, threadId);

  const loadingComments = useSelector(selectLoadingComments, threadId);
  const loadingCommentsError = useSelector(selectLoadingCommentsError, threadId);
  const comments = useSelector(selectThreadComments, threadId);

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
            <Date date={thread.date} format="'Le' d MMMM yyyy" />, {comments?.length ?? '?'} commentaires
          </div>
        </div>

        <Markdown markdown={thread.text} className="p-4 sm:p-5 card" />
      </div>

      <ThreadFilters threadId={threadId} className="my-4" />

      <AsyncResource
        data={comments}
        loading={loadingComments}
        error={loadingCommentsError}
        renderLoading={(comments) => (
          <div className="relative">
            {renderComments(comments ?? [])}
            <div className="absolute inset-0 bg-neutral/50 animate-loading-surface" />
          </div>
        )}
        render={renderComments}
      />

      {/* <ShareCommentModal comments={comments} /> */}
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
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
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

type RootCommentFormProps = {
  threadId: string;
  author: User;
};

const RootCommentForm = ({ threadId, author }: RootCommentFormProps) => {
  const dispatch = useDispatch();

  const message = useSelector(selectRootCommentFormText, threadId);
  const canSubmit = useSelector(selectCanSubmitRootComment, threadId);
  const isSubmitting = useSelector(selectIsSubmittingRootComment, threadId);

  return (
    <CommentForm
      autofocus={false}
      placeholder={`Répondre à ${author.nick}`}
      message={message}
      setMessage={(text) => dispatch(setCreateRootCommentText(threadId, text))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onSubmit={() => dispatch(createRootComment(threadId))}
    />
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
