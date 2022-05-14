import { AvatarNick } from '~/components/domain/avatar/avatar-nick';
import { Date } from '~/components/elements/date';
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
      <div className="flex flex-row justify-between items-center my-2">
        <AvatarNick big user={thread.author} />
        <div className="text-text-light">
          <Date date={thread.date} format="'Le' d MMMM yyyy" />, {thread.comments.length} commentaires
        </div>
      </div>

      <div className="flex-1 card">
        <Markdown markdown={thread.text} />
      </div>
    </div>

    <ThreadFilters className="my-4" />

    <div className="py-1 px-2 bg-white rounded">
      <CommentsList comments={thread.comments} />
    </div>
  </>
);
