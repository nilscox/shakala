import { clsx } from 'clsx';
import {
  selectComment,
  selectFormattedCommentDate,
  selectFormattedCommentDateDetailed,
} from 'frontend-domain';

import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Link } from '~/components/elements/link';
import { useSelector } from '~/hooks/use-selector';

const bullet = '•';

type CommentHeaderProps = {
  commentId: string;
  className?: string;
};

export const CommentHeader = ({ commentId, className }: CommentHeaderProps) => {
  const { author, date, edited } = useSelector(selectComment, commentId);
  const formattedDate = useSelector(selectFormattedCommentDate, commentId);
  const formattedDateDetailed = useSelector(selectFormattedCommentDateDetailed, commentId);

  return (
    <div className={clsx('gap-2 items-center row', className)}>
      <AvatarNick {...author} />
      <div>{bullet}</div>
      <Link
        to={`#${commentId}`}
        className={clsx('text-sm leading-none text-muted hover:underline decoration-muted/40', {
          italic: edited,
        })}
      >
        <time dateTime={date} title={formattedDateDetailed}>
          {formattedDate}
        </time>
      </Link>
    </div>
  );
};
