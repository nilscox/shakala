import { useSearchParams } from 'react-router-dom';

import { AvatarNick } from '~/components/domain/avatar/avatar-nick';
import { Date } from '~/components/elements/date';
import { Fallback } from '~/components/elements/fallback';
import { Markdown } from '~/components/elements/markdown';
import { Thread as ThreadType } from '~/types';

import { CommentsList } from '../comment/comments-list';

import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  thread: ThreadType;
};

export const Thread = ({ thread }: ThreadProps) => (
  <>
    <div className="my-[60px]">
      <div className="flex flex-row justify-between items-center mb-2">
        <AvatarNick big user={thread.author} />
        <div className="text-text-light">
          <Date date={thread.date} format="'Le' d MMMM yyyy" />, {thread.comments.length} commentaires
        </div>
      </div>

      <Markdown markdown={thread.text} className="p-4 card" />
    </div>

    <ThreadFilters className="my-4" />

    <CommentsList comments={thread.comments} />

    {thread.comments.length === 0 && <NoCommentFallback />}
  </>
);

const NoCommentFallback = () => {
  const [params] = useSearchParams();
  const search = params.get('search');

  if (search) {
    return <Fallback>Aucun commentaire n'a été trouvé pour cette recherche.</Fallback>;
  }

  return <Fallback>Aucun commentaire n'a été publié pour le moment.</Fallback>;
};
