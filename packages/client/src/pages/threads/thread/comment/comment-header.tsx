import { CommentDto, ReplyDto } from '@shakala/shared';
import { clsx } from 'clsx';

import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { DateTime } from '~/elements/date-time';
import { Link } from '~/elements/link';

const bullet = '•';

type CommentHeaderProps = {
  comment: CommentDto | ReplyDto;
  className?: string;
};

export const CommentHeader = ({ comment, className }: CommentHeaderProps) => (
  <div className={clsx('row items-center gap-2', className)}>
    <AvatarNick nick={comment.author.nick} image={comment.author.profileImage} />
    <div>{bullet}</div>
    <Link
      href={`#${comment.id}`}
      className={clsx('text-xs leading-none text-muted decoration-muted/40 hover:underline', {
        italic: comment.edited,
      })}
    >
      <DateTime date={comment.date} />
    </Link>
    {/* <div className="text-xs ml-auto">{commentId}</div> */}
  </div>
);
