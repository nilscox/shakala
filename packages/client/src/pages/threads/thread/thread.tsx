import { ThreadDto } from '@shakala/shared';
import { Helmet } from 'react-helmet';

import { PageTitle } from '~/app/page-title';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { Fallback } from '~/elements/fallback';
import { useSearchParam } from '~/hooks/use-search-params';
import { useUser } from '~/hooks/use-user';
import { DateFormat, formatDate } from '~/utils/date-utils';

import { Comment } from './comment/comment';
import { RootCommentForm } from './comment-form/root-comment-form';
import { ShareCommentModal } from './modals/share-comment-modal';
import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  thread: ThreadDto;
};

export const Thread = ({ thread }: ThreadProps) => (
  <>
    <PageTitle>{`${thread.author.nick} : ${thread.text}`}</PageTitle>
    <ThreadMeta {...thread} />

    <div className="my-5 md:mt-10">
      <div className="row mb-2 flex-wrap items-center justify-between gap-4">
        <AvatarNick size="medium" nick={thread.author.nick} image={thread.author.profileImage} />
        <div className="text-muted">
          <time dateTime={thread.date}>{formatDate(thread.date, DateFormat.full)}</time>,{' '}
          {thread.comments.length} commentaires
        </div>
      </div>

      {/* <Markdown markdown={text} className="card p-4 sm:p-5" /> */}
      <div className="card p-4 sm:p-5">{thread.text}</div>
    </div>

    {thread.comments.length > 0 && <ThreadFilters thread={thread} className="mt-10 mb-4" />}

    <CommentsList thread={thread} />

    <ShareCommentModal />
  </>
);

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
  thread: ThreadDto;
};

const CommentsList = ({ thread }: CommentsListProps) => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      {thread.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}

      {thread.comments.length === 0 && <NoCommentFallback />}

      <div className="card">
        <div className="flex flex-row items-center gap-4 p-2 pb-0">
          <AvatarNick image={user?.profileImage} nick={user?.nick ?? 'Moi'} />
        </div>

        <RootCommentForm thread={thread} />
      </div>
    </div>
  );
};

const NoCommentFallback = () => {
  const [search] = useSearchParam('search');

  if (search) {
    return <Fallback className="!max-h-1">Aucun commentaire n'a été trouvé pour cette recherche.</Fallback>;
  }

  return <Fallback className="!min-h-1">Aucun commentaire n'a été publié pour le moment.</Fallback>;
};
