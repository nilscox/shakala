import { UserActivityDto, UserActivityType } from '@shakala/shared';
import { clsx } from 'clsx';

import { Link } from '~/elements/link';
import { DateFormat, formatDate, formatDateRelativeOrAbsolute } from '~/utils/date-utils';

export type ActivityItem<Type extends UserActivityType> = React.ComponentType<{
  isFirst: boolean;
  activity: UserActivityDto<Type>;
}>;

type ActivityComponentProps = {
  isFirst: boolean;
  activity: UserActivityDto;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const Activity = ({ isFirst, activity, icon, children }: ActivityComponentProps) => (
  <div className="row items-stretch gap-4">
    <div className="col">
      <div className="ml-5 h-2 border-l" />
      <div className="flex h-8 w-8 items-center justify-center rounded-full border text-muted">{icon}</div>
      <div className={clsx('ml-5 flex-1', !isFirst && 'border-l')} />
    </div>

    {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
    <div className="mb-2 mt-1 [&>p]:my-0">
      <div className="text-xs font-medium text-muted/75">
        <time dateTime={activity.date} title={formatDate(activity.date, DateFormat.full)}>
          {formatDateRelativeOrAbsolute(activity.date)}
        </time>
      </div>

      {children}
    </div>
  </div>
);

type ThreadLinkProps = {
  threadId: string;
  threadDescription: string;
};

export const ThreadLink = ({ threadId, threadDescription }: ThreadLinkProps) => {
  return <Link href={`/discussions/${threadId}`}>{threadDescription}</Link>;
};

type CommentLinkProps = {
  threadId: string;
  commentId: string;
  children: React.ReactNode;
};

export const CommentLink = ({ threadId, commentId, children }: CommentLinkProps) => {
  return <Link href={`/discussions/${threadId}#${commentId}`}>{children}</Link>;
};
