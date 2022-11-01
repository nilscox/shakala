import { clsx } from 'clsx';
import {
  selectComment,
  selectFormattedCommentDate,
  selectFormattedCommentDateDetailed,
} from 'frontend-domain';

import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { Link } from '~/elements/link';
import { useAppSelector } from '~/hooks/use-app-selector';

const bullet = '•';

type CommentHeaderProps = {
  commentId: string;
  className?: string;
};

export const CommentHeader = ({ commentId, className }: CommentHeaderProps) => {
  const { author, date, edited } = useAppSelector(selectComment, commentId);

  const formattedDate = useAppSelector(selectFormattedCommentDate, commentId);
  const formattedDateDetailed = useAppSelector(selectFormattedCommentDateDetailed, commentId);

  return (
    <div className={clsx('row items-center gap-2', className)}>
      <AvatarNick {...author} />
      <div>{bullet}</div>
      <Link
        href={`#${commentId}`}
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
