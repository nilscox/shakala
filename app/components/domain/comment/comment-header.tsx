import { AvatarNick } from '~/components/domain/avatar/avatar-nick';
import { Date } from '~/components/elements/date';
import { User } from '~/types';

type CommentHeaderProps = {
  author: User;
  date: string;
};

export const CommentHeader = ({ author, date }: CommentHeaderProps) => (
  <div className="flex flex-row justify-between items-center">
    <AvatarNick user={author} />
    <Date date={date} className="text-sm text-text-light" />
  </div>
);
