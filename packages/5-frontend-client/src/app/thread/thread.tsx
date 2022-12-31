import {
  Comment as CommentType,
  commentActions,
  DateFormat,
  formatDate,
  threadSelectors,
  User,
} from '@shakala/frontend-domain';
import Head from 'next/head';
import { useEffect } from 'react';

import { PageTitle } from '~/app/page-title';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { Fallback } from '~/elements/fallback';
import { Markdown } from '~/elements/markdown';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useSearchParam } from '~/hooks/use-search-param';
import { useUser } from '~/hooks/use-user';

import {
  Comment,
  CommentHistoryModal,
  ReportCommentModal,
  RootCommentForm,
  ShareCommentModal,
} from '../comment';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  threadId: string;
};

export const Thread = ({ threadId }: ThreadProps) => {
  const dispatch = useAppDispatch();

  const thread = useAppSelector(threadSelectors.byId, threadId);
  const { author, date, text, comments } = thread;

  useEffect(() => {
    dispatch(commentActions.openDraftComments(threadId));
  }, [dispatch, threadId]);

  return (
    <>
      <PageTitle>{`${author.nick} : ${text}`}</PageTitle>
      <ThreadMeta {...thread} />

      <div className="my-5 md:my-10">
        <div className="row mb-2 flex-wrap items-center justify-between gap-4">
          <AvatarNick size="medium" {...author} />
          <div className="text-muted">
            <time dateTime={date}>{formatDate(date, DateFormat.full)}</time>, {comments.length} commentaires
          </div>
        </div>

        <Markdown markdown={text} className="card p-4 sm:p-5" />
      </div>

      <ThreadFilters threadId={threadId} className="my-4" />

      {comments.length === 0 && <NoCommentFallback />}
      <CommentsList threadId={threadId} threadAuthor={author} comments={comments} />

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

const ThreadMeta = ({ description, keywords }: ThreadMetaProps) => (
  <Head>
    <meta name="description" content={description}></meta>
    <meta name="keywords" content={keywords.join(', ')}></meta>
  </Head>
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
