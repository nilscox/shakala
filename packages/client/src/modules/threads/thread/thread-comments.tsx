import { isCommentSort, ThreadDto } from '@shakala/shared';

import { TOKENS } from '~/app/tokens';
import { Fallback } from '~/elements/fallback';
import { useQuery } from '~/hooks/use-query';
import { useSearchParam } from '~/hooks/use-search-params';

import { Comment } from './comment/comment';
import { RootCommentForm } from './comment-form/root-comment-form';

type ThreadCommentsProps = {
  thread: ThreadDto;
};

export const ThreadComments = ({ thread }: ThreadCommentsProps) => {
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
