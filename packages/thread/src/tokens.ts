import { token } from 'brandi';

import { CreateCommentHandler } from './commands/create-comment/create-comment';
import { CreateThreadHandler } from './commands/create-thread/create-thread';
import { EditCommentHandler } from './commands/edit-comment/edit-comment';
import { ReportCommentHandler } from './commands/report-comment/report-comment';
import { SetCommentSubscriptionHandler } from './commands/set-comment-subscription/set-comment-subscription';
import { SetReactionHandler } from './commands/set-reaction/set-reaction';
import { CreateCommentCreatedSubscriptionHandler } from './event-handlers/comment-created-create-subscription/comment-created-create-subscription';
import { CreateReplyCreatedNotificationsHandler } from './event-handlers/create-reply-created-notification/create-comment-reply-notification';
import { CreateThreadCreatedNotificationsHandler } from './event-handlers/create-thread-created-notifications/create-thread-created-notifications';
import { GetCommentHandler } from './queries/get-comment';
import { GetLastThreadsHandler } from './queries/get-last-threads';
import { GetThreadHandler } from './queries/get-thread';
import { CommentRepository } from './repositories/comment/comment.repository';
import { CommentReportRepository } from './repositories/comment-report/comment-report.repository';
import { CommentSubscriptionRepository } from './repositories/comment-subscription/comment-subscription.repository';
import { ReactionRepository } from './repositories/reaction/reaction.repository';
import { ThreadRepository } from './repositories/thread/thread.repository';

export const THREAD_TOKENS = {
  repositories: {
    threadRepository: token<ThreadRepository>('threadRepository'),
    commentRepository: token<CommentRepository>('commentRepository'),
    reactionRepository: token<ReactionRepository>('reactionRepository'),
    commentSubscriptionRepository: token<CommentSubscriptionRepository>('commentSubscriptionRepository'),
    commentReportRepository: token<CommentReportRepository>('commentReportRepository'),
  },
  commands: {
    createThreadHandler: token<CreateThreadHandler>('createThreadHandler'),
    createCommentHandler: token<CreateCommentHandler>('createCommentHandler'),
    editCommentHandler: token<EditCommentHandler>('editCommentHandler'),
    setReactionHandler: token<SetReactionHandler>('setReactionHandler'),
    setCommentSubscriptionHandler: token<SetCommentSubscriptionHandler>('setCommentSubscriptionHandler'),
    reportCommentHandler: token<ReportCommentHandler>('reportCommentHandler'),
  },
  queries: {
    getLastThreadsHandler: token<GetLastThreadsHandler>('getLastThreadsHandler'),
    getThreadHandler: token<GetThreadHandler>('getThreadHandler'),
    getCommentHandler: token<GetCommentHandler>('getCommentHandler'),
  },
  // prettier-ignore
  eventHandlers: {
    createCommentCreatedSubscriptionHandler: token<CreateCommentCreatedSubscriptionHandler>('createCommentCreatedSubscriptionHandler'),
    createThreadCreatedNotificationsHandler: token<CreateThreadCreatedNotificationsHandler>('createThreadCreatedNotificationsHandler'),
    createReplyCreatedNotificationsHandler: token<CreateReplyCreatedNotificationsHandler>('createReplyCreatedNotificationsHandler'),
  },
};
