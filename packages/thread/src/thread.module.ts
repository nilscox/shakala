import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { CreateCommentHandler } from './commands/create-comment/create-comment';
import { CreateThreadHandler } from './commands/create-thread/create-thread';
import { EditCommentHandler } from './commands/edit-comment/edit-comment';
import { ReportCommentHandler } from './commands/report-comment/report-comment';
import { SetCommentSubscriptionHandler } from './commands/set-comment-subscription/set-comment-subscription';
import { SetReactionHandler } from './commands/set-reaction/set-reaction';
import { CreateCommentCreatedSubscriptionHandler } from './event-handlers/comment-created-create-subscription/comment-created-create-subscription';
import { CreateReplyCreatedNotificationsHandler } from './event-handlers/create-reply-created-notification/create-comment-reply-notification';
import { CreateThreadCreatedNotificationsHandler } from './event-handlers/create-thread-created-notifications/create-thread-created-notifications';
import { ThreadUserActivitiesHandler } from './event-handlers/thread-user-activities/thread-user-activities';
import { GetCommentHandler } from './queries/get-comment';
import { GetLastThreadsHandler } from './queries/get-last-threads';
import { GetThreadHandler } from './queries/get-thread';
import { GetThreadCommentsHandler } from './queries/get-thread-comments';
import { SqlCommentRepository } from './repositories/comment/sql-comment.repository';
import { SqlCommentReportRepository } from './repositories/comment-report/sql-comment-report.repository';
import { SqlCommentSubscriptionRepository } from './repositories/comment-subscription/sql-comment-subscription.repository';
import { SqlReactionRepository } from './repositories/reaction/sql-reaction.repository';
import { SqlThreadRepository } from './repositories/thread/sql-thread.repository';
import { THREAD_TOKENS } from './tokens';

class ThreadModule extends Module {
  init(container: Container) {
    this.expose(container, THREAD_TOKENS.commands);
    this.expose(container, THREAD_TOKENS.queries);
    this.expose(container, THREAD_TOKENS.eventHandlers);
  }
}

export const module = new ThreadModule();

module.bind(THREAD_TOKENS.repositories.threadRepository).toInstance(SqlThreadRepository).inSingletonScope();
module.bind(THREAD_TOKENS.repositories.commentRepository).toInstance(SqlCommentRepository).inSingletonScope();
module.bind(THREAD_TOKENS.repositories.reactionRepository).toInstance(SqlReactionRepository).inSingletonScope();
module.bind(THREAD_TOKENS.repositories.commentSubscriptionRepository).toInstance(SqlCommentSubscriptionRepository).inSingletonScope();
module.bind(THREAD_TOKENS.repositories.commentReportRepository).toInstance(SqlCommentReportRepository).inSingletonScope();

module.bind(THREAD_TOKENS.commands.createThreadHandler).toInstance(CreateThreadHandler).inSingletonScope();
module.bind(THREAD_TOKENS.commands.createCommentHandler).toInstance(CreateCommentHandler).inSingletonScope();
module.bind(THREAD_TOKENS.commands.editCommentHandler).toInstance(EditCommentHandler).inSingletonScope();
module.bind(THREAD_TOKENS.commands.setReactionHandler).toInstance(SetReactionHandler).inSingletonScope();
module.bind(THREAD_TOKENS.commands.setCommentSubscriptionHandler).toInstance(SetCommentSubscriptionHandler).inSingletonScope();
module.bind(THREAD_TOKENS.commands.reportCommentHandler).toInstance(ReportCommentHandler).inSingletonScope();

module.bind(THREAD_TOKENS.queries.getLastThreadsHandler).toInstance(GetLastThreadsHandler).inSingletonScope();
module.bind(THREAD_TOKENS.queries.getThreadHandler).toInstance(GetThreadHandler).inSingletonScope();
module.bind(THREAD_TOKENS.queries.getThreadCommentsHandler).toInstance(GetThreadCommentsHandler).inSingletonScope();
module.bind(THREAD_TOKENS.queries.getCommentHandler).toInstance(GetCommentHandler).inSingletonScope();

module.bind(THREAD_TOKENS.eventHandlers.createCommentCreatedSubscriptionHandler).toInstance(CreateCommentCreatedSubscriptionHandler).inSingletonScope();
module.bind(THREAD_TOKENS.eventHandlers.createThreadCreatedNotificationsHandler).toInstance(CreateThreadCreatedNotificationsHandler).inSingletonScope();
module.bind(THREAD_TOKENS.eventHandlers.createReplyCreatedNotificationsHandler).toInstance(CreateReplyCreatedNotificationsHandler).inSingletonScope();
module.bind(THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler).toInstance(ThreadUserActivitiesHandler).inSingletonScope();
