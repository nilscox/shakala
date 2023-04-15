import { AuthorDto, isCommentSort, ThreadDto } from '@shakala/shared';
import { Helmet } from 'react-helmet';

import { PageTitle } from '~/app/page-title';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { Fallback } from '~/elements/fallback';
import { RichText } from '~/elements/rich-text';
import { useQuery } from '~/hooks/use-query';
import { useSearchParam } from '~/hooks/use-search-params';
import { DateFormat, formatDate } from '~/utils/date-utils';

import { Comment } from './comment/comment';
import { RootCommentForm } from './comment-form/root-comment-form';
import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  thread: ThreadDto;
};

export const Thread = ({ thread }: ThreadProps) => (
  <>
    <PageTitle>{`${thread.author.nick} : ${thread.text}`}</PageTitle>
    <ThreadMeta {...thread} />

    <div className="my-5 md:my-10">
      <ThreadHeader {...thread} />
      <RichText className="card p-4 sm:p-5">{thread.text}</RichText>
    </div>

    <ThreadFilters thread={thread} className="mb-4" />

    <CommentsList thread={thread} />
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

type ThreadHeaderProps = {
  author: AuthorDto;
  date: string;
  description: string;
  totalComments: number;
};

const ThreadHeader = ({ author, date, description, totalComments }: ThreadHeaderProps) => (
  <div className="row mb-2 flex-wrap items-center gap-4">
    <AvatarNick size="medium" nick={author.nick} image={author.profileImage} />

    <div className="flex-1 border-l-2 pl-2 font-medium text-muted line-clamp-1">{description}</div>

    <div className="text-muted">
      <time dateTime={date}>{formatDate(date, DateFormat.full)}</time>, {totalComments} commentaires
    </div>
  </div>
);

type CommentsListProps = {
  thread: ThreadDto;
};

const CommentsList = ({ thread }: CommentsListProps) => {
  const [search] = useSearchParam('search');
  const [sortParam] = useSearchParam('sort');
  const sort = isCommentSort(sortParam) ? sortParam : undefined;

  const comments = useQuery(TOKENS.thread, 'getThreadComments', thread.id, { sort, search });

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}

      {comments.length === 0 && <NoCommentFallback />}

      <div className="card">
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
