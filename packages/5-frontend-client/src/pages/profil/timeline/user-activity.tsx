import { clsx } from 'clsx';
import {
  DateFormat,
  formatDate,
  formatDateRelativeOrAbsolute,
  selectIsFirstUserActivity,
  UserActivity,
} from 'frontend-domain';
import { UserActivityType } from 'shared';

import { Link } from '~/elements/link';
import { useAppSelector } from '~/hooks/use-app-selector';

export type ActivityItem<Type extends UserActivityType> = React.ComponentType<{
  activity: UserActivity<Type>;
}>;

type ActivityComponentProps = {
  activity: UserActivity;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const Activity = ({ activity, icon, children }: ActivityComponentProps) => {
  const isFirst = useAppSelector(selectIsFirstUserActivity, activity);

  return (
    <div className="row items-center gap-4">
      <div>
        <div className="ml-5 h-2 border-l" />
        <div className="flex h-8 w-8 items-center justify-center rounded-full border text-muted">{icon}</div>
        <div className={clsx('ml-5 h-2', !isFirst && 'border-l')} />
      </div>
      <div>
        <div className="relative -top-2 h-0 text-xs font-medium text-muted/75">
          <time dateTime={activity.date} title={formatDate(activity.date, DateFormat.full)}>
            {formatDateRelativeOrAbsolute(activity.date)}
          </time>
        </div>
        {children}
      </div>
    </div>
  );
};

type ThreadLinkProps = {
  threadId: string;
  threadDescription: string;
};

export const ThreadLink = ({ threadId, threadDescription }: ThreadLinkProps) => {
  return <Link to={`/discussions/${threadId}`}>{threadDescription}</Link>;
};

type CommentLinkProps = {
  threadId: string;
  commentId: string;
  children: React.ReactNode;
};

export const CommentLink = ({ threadId, commentId, children }: CommentLinkProps) => {
  return <Link to={`/discussions/${threadId}#${commentId}`}>{children}</Link>;
};
