import { Module } from '@shakala/common';

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
import { FilesystemCommentRepository } from './repositories/comment/filesystem-comment.repository';
import { InMemoryCommentRepository } from './repositories/comment/in-memory-comment.repository';
import { SqlCommentRepository } from './repositories/comment/sql-comment.repository';
import { FilesystemCommentReportRepository } from './repositories/comment-report/filesystem-comment-report.repository';
import { InMemoryCommentReportRepository } from './repositories/comment-report/in-memory-comment-report.repository';
import { SqlCommentReportRepository } from './repositories/comment-report/sql-comment-report.repository';
import { FilesystemCommentSubscriptionRepository } from './repositories/comment-subscription/filesystem-comment-subscription.repository';
import { InMemoryCommentSubscriptionRepository } from './repositories/comment-subscription/in-memory-comment-subscription.repository';
import { SqlCommentSubscriptionRepository } from './repositories/comment-subscription/sql-comment-subscription.repository';
import { FilesystemReactionRepository } from './repositories/reaction/filesystem-reaction.repository';
import { InMemoryReactionRepository } from './repositories/reaction/in-memory-reaction.repository';
import { SqlReactionRepository } from './repositories/reaction/sql-reaction.repository';
import { FilesystemThreadRepository } from './repositories/thread/filesystem-thread.repository';
import { InMemoryThreadRepository } from './repositories/thread/in-memory-thread.repository';
import { SqlThreadRepository } from './repositories/thread/sql-thread.repository';
import { THREAD_TOKENS } from './tokens';

type ThreadModuleConfig = {
  repositories: 'memory' | 'filesystem' | 'sql';
};

export class ThreadModule extends Module {
  configure(config: ThreadModuleConfig) {
    // prettier-ignore
    if (config.repositories === 'memory') {
      this.bindToken(THREAD_TOKENS.repositories.threadRepository, InMemoryThreadRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.commentRepository, InMemoryCommentRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.reactionRepository, InMemoryReactionRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.commentSubscriptionRepository, InMemoryCommentSubscriptionRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.commentReportRepository, InMemoryCommentReportRepository, false);
    } else if (config.repositories === 'filesystem') {
      this.bindToken(THREAD_TOKENS.repositories.threadRepository, FilesystemThreadRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.commentRepository, FilesystemCommentRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.reactionRepository, FilesystemReactionRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.commentSubscriptionRepository, FilesystemCommentSubscriptionRepository, false);
      this.bindToken(THREAD_TOKENS.repositories.commentReportRepository, FilesystemCommentReportRepository, false);
    } else {
      this.bindToken(THREAD_TOKENS.repositories.threadRepository, SqlThreadRepository);
      this.bindToken(THREAD_TOKENS.repositories.commentRepository, SqlCommentRepository);
      this.bindToken(THREAD_TOKENS.repositories.reactionRepository, SqlReactionRepository);
      this.bindToken(THREAD_TOKENS.repositories.commentSubscriptionRepository, SqlCommentSubscriptionRepository);
      this.bindToken(THREAD_TOKENS.repositories.commentReportRepository, SqlCommentReportRepository);
    }

    this.bindToken(THREAD_TOKENS.commands.createThreadHandler, CreateThreadHandler);
    this.bindToken(THREAD_TOKENS.commands.createCommentHandler, CreateCommentHandler);
    this.bindToken(THREAD_TOKENS.commands.editCommentHandler, EditCommentHandler);
    this.bindToken(THREAD_TOKENS.commands.setReactionHandler, SetReactionHandler);
    this.bindToken(THREAD_TOKENS.commands.setCommentSubscriptionHandler, SetCommentSubscriptionHandler);
    this.bindToken(THREAD_TOKENS.commands.reportCommentHandler, ReportCommentHandler);

    this.bindToken(THREAD_TOKENS.queries.getLastThreadsHandler, GetLastThreadsHandler);
    this.bindToken(THREAD_TOKENS.queries.getThreadHandler, GetThreadHandler);
    this.bindToken(THREAD_TOKENS.queries.getThreadCommentsHandler, GetThreadCommentsHandler);
    this.bindToken(THREAD_TOKENS.queries.getCommentHandler, GetCommentHandler);

    // prettier-ignore
    {
      this.bindToken(THREAD_TOKENS.eventHandlers.createCommentCreatedSubscriptionHandler, CreateCommentCreatedSubscriptionHandler);
      this.bindToken(THREAD_TOKENS.eventHandlers.createThreadCreatedNotificationsHandler, CreateThreadCreatedNotificationsHandler);
      this.bindToken(THREAD_TOKENS.eventHandlers.createReplyCreatedNotificationsHandler, CreateReplyCreatedNotificationsHandler);
      this.bindToken(THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler, ThreadUserActivitiesHandler);
    }
  }
}
