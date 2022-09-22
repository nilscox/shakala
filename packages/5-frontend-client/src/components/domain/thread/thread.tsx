import {
  Comment as CommentType,
  selectFormattedThreadDate,
  selectFetchCommentsError,
  selectThread,
  selectThreadComments,
  Sort,
  User,
  selectIsFetchingComments,
  selectCreatedRootComments,
} from 'frontend-domain';
import { Helmet } from 'react-helmet';

import { AsyncResource } from '~/components/elements/async-resource/async-resource';
import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Fallback } from '~/components/elements/fallback';
import { Markdown } from '~/components/elements/markdown';
import { PageTitle } from '~/components/layout/page-title';
import { useSearchParam } from '~/hooks/use-search-param';
import { useSelector } from '~/hooks/use-selector';
import { useUser } from '~/hooks/use-user';

import { RootCommentForm } from '../comment-form';
import { CommentHistoryModal } from '../comment-history-modal';
import { Comment } from '../comment/comment';
import { ShareCommentModal } from '../share-comment';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  threadId: string;
};

export const Thread = ({ threadId }: ThreadProps) => {
  const thread = useSelector(selectThread, threadId);

  const search = useSearchParam('search');
  const sort = useSearchParam('sort') as Sort;

  const loadingComments = useSelector(selectIsFetchingComments, threadId, search, sort);
  const loadingCommentsError = useSelector(selectFetchCommentsError, threadId, search, sort);
  const comments = useSelector(selectThreadComments, threadId, search, sort);
  const createdComments = useSelector(selectCreatedRootComments);

  const dateFormatted = useSelector(selectFormattedThreadDate, threadId);

  const renderComments = (comments: CommentType[]) => (
    <>
      {comments.length === 0 && <NoCommentFallback />}
      <CommentsList
        threadId={threadId}
        threadAuthor={thread.author}
        comments={[...comments, ...createdComments]}
      />
    </>
  );

  return (
    <>
      <PageTitle>{`${thread.author.nick} : ${thread.text}`}</PageTitle>
      <ThreadMeta {...thread} />

      <div className="my-5 md:my-10">
        <div className="row mb-2 flex-wrap items-center justify-between gap-4">
          <AvatarNick big {...thread.author} />
          <div className="text-muted">
            <time dateTime={thread.date}>{dateFormatted}</time>, {comments?.length ?? '?'} commentaires
          </div>
        </div>

        <Markdown markdown={thread.text} className="card p-4 sm:p-5" />
      </div>

      <ThreadFilters threadId={threadId} className="my-4" />

      <AsyncResource
        data={comments}
        loading={loadingComments}
        error={loadingCommentsError}
        render={renderComments}
      />

      <CommentHistoryModal />
      <ShareCommentModal />
    </>
  );
};

type ThreadMetaProps = {
  description: string;
  keywords: string[];
};

const ThreadMeta = ({ description, keywords }: ThreadMetaProps) => (
  <Helmet>
    <meta name="description" content={description}></meta>
    <meta name="keywords" content={keywords.join(', ')}></meta>
  </Helmet>
);

type CommentsListProps = {
  threadId: string;
  threadAuthor: User;
  comments: CommentType[];
};

const CommentsList = ({ threadId, threadAuthor, comments }: CommentsListProps) => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      {comments.map(({ id }) => (
        <Comment key={id} commentId={id} />
      ))}

      <div className="card">
        <div className="flex flex-row items-center gap-4 p-2 pb-0">
          <AvatarNick image={user?.profileImage} nick={user?.nick ?? 'Moi'} />
        </div>

        <RootCommentForm threadId={threadId} author={threadAuthor} />
      </div>
    </div>
  );
};

const NoCommentFallback = () => {
  const search = useSearchParam('search');

  if (search) {
    return <Fallback>Aucun commentaire n'a été trouvé pour cette recherche.</Fallback>;
  }

  return <Fallback>Aucun commentaire n'a été publié pour le moment.</Fallback>;
};
