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
    <div className={clsx('row items-center gap-2', className)}>
      <AvatarNick {...author} />
      <div>{bullet}</div>
      <Link
        to={`#${commentId}`}
        className={clsx('text-xs leading-none text-muted decoration-muted/40 hover:underline', {
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
