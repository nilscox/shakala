import { Link } from 'react-router-dom';

import { AvatarNick } from '~/components/domain/avatar/avatar-nick';
import { Date } from '~/components/elements/date';
import { User } from '~/types';

type CommentHeaderProps = {
  commentId: string;
  author: User;
  date: string;
};

export const CommentHeader = ({ commentId, author, date }: CommentHeaderProps) => (
  <div className="flex flex-row gap-2 items-center">
    <AvatarNick user={author} />
    {bullet}
    <Link to={`#${commentId}`} className="hover:underline decoration-text-light/40">
      <Date
        date={date}
        format="'le' d MMMM"
        titleFormat="'Le' d MMMM yyyy 'à' HH:mm"
        className="text-sm text-text-light"
      />
    </Link>
  </div>
);

const bullet = '•';
