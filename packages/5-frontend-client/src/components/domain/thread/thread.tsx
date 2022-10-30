'use client';

import { Comment as CommentType, DateFormat, formatDate, selectThread, User } from 'frontend-domain';

import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Fallback } from '~/components/elements/fallback';
import { Markdown } from '~/components/elements/markdown';
import { useUser } from '~/hooks/use-user';

import { PageTitle } from '../../../app/page-title';
import { useSearchParam } from '../../../hooks/use-search-param';
import { useSelector } from '../../../hooks/use-selector';
import { RootCommentForm } from '../comment-form';
import { CommentHistoryModal } from '../comment-history-modal';
import { Comment } from '../comment/comment';
import { ReportCommentModal } from '../report-comment-modal/report-comment-modal';
import { ShareCommentModal } from '../share-comment';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  threadId: string;
};

export const Thread = ({ threadId }: ThreadProps) => {
  const thread = useSelector(selectThread, threadId);
  const dateFormatted = formatDate(thread.date, DateFormat.full);
  const { comments } = thread;

  // todo
  const createdComments: CommentType[] = [];

  return (
    <>
      <PageTitle>{`${thread.author.nick} : ${thread.text}`}</PageTitle>
      <ThreadMeta {...thread} />

      <div className="my-5 md:my-10">
        <div className="row mb-2 flex-wrap items-center justify-between gap-4">
          <AvatarNick size="medium" {...thread.author} />
          <div className="text-muted">
            <time dateTime={thread.date}>{dateFormatted}</time>, {comments.length} commentaires
          </div>
        </div>

        <Markdown markdown={thread.text} className="card p-4 sm:p-5" />
      </div>

      <ThreadFilters threadId={threadId} className="my-4" />

      {comments.length === 0 && <NoCommentFallback />}
      <CommentsList
        threadId={threadId}
        threadAuthor={thread.author}
        comments={[...comments, ...createdComments]}
      />

      <ReportCommentModal />
      <CommentHistoryModal />
      <ShareCommentModal />
    </>
  );
};

type ThreadMetaProps = {
  description: string;
  keywords: string[];
};

// todo: add next/head when available
const ThreadMeta = ({ description, keywords }: ThreadMetaProps) => (
  <>
    <meta name="description" content={description}></meta>
    <meta name="keywords" content={keywords.join(', ')}></meta>
  </>
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
