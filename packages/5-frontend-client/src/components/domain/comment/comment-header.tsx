import clsx from 'clsx';
import { User } from 'frontend-domain';
import { Link } from 'react-router-dom';

import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Date } from '~/components/elements/date';

const bullet = '•';

type CommentHeaderProps = {
  commentId: string;
  author: User;
  date: string;
  className?: string;
};

export const CommentHeader = ({ commentId, author, date, className }: CommentHeaderProps) => (
  <div className={clsx('gap-2 items-center row', className)}>
    <AvatarNick {...author} />
    <div>{bullet}</div>
    <Link
      to={`#${commentId}`}
      className="text-sm leading-none text-muted hover:underline decoration-muted/40"
    >
      <Date date={date} format="'le' d MMMM" titleFormat="'Le' d MMMM yyyy 'à' HH:mm" />
    </Link>
  </div>
);
