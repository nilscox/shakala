import { Module } from '@shakala/common';

import { CreateCommentHandler } from './commands/create-comment/create-comment';
import { CreateThreadHandler } from './commands/create-thread/create-thread';
import { EditCommentHandler } from './commands/edit-comment/edit-comment';
import { ReportCommentHandler } from './commands/report-comment/report-comment';
import { SetCommentSubscriptionHandler } from './commands/set-comment-subscription/set-comment-subscription';
import { SetReactionHandler } from './commands/set-reaction/set-reaction';
import { CreateThreadCreatedNotificationsHandler } from './event-handlers/create-thread-created-notifications/create-thread-created-notifications';
import { GetCommentHandler } from './queries/get-comment';
import { GetLastThreadsHandler } from './queries/get-last-threads';
import { GetThreadHandler } from './queries/get-thread';
import { FilesystemCommentRepository } from './repositories/comment/filesystem-comment.repository';
import { InMemoryCommentRepository } from './repositories/comment/in-memory-comment.repository';
import { FilesystemCommentReportRepository } from './repositories/comment-report/filesystem-comment-report.repository';
import { FilesystemCommentSubscriptionRepository } from './repositories/comment-subscription/filesystem-comment-subscription.repository';
import { FilesystemReactionRepository } from './repositories/reaction/filesystem-reaction.repository';
import { InMemoryReactionRepository } from './repositories/reaction/in-memory-reaction.repository';
import { FilesystemThreadRepository } from './repositories/thread/filesystem-thread.repository';
import { InMemoryThreadRepository } from './repositories/thread/in-memory-thread.repository';
import { THREAD_TOKENS } from './tokens';

type ThreadModuleConfig = {
  repositories: 'memory' | 'filesystem';
};

export class ThreadModule extends Module {
  configure(config: ThreadModuleConfig) {
    if (config.repositories === 'memory') {
      this.bindToken(THREAD_TOKENS.repositories.threadRepository, InMemoryThreadRepository);
      this.bindToken(THREAD_TOKENS.repositories.commentRepository, InMemoryCommentRepository);
      this.bindToken(THREAD_TOKENS.repositories.reactionRepository, InMemoryReactionRepository);
    } else {
      this.bindToken(THREAD_TOKENS.repositories.threadRepository, FilesystemThreadRepository);
      this.bindToken(THREAD_TOKENS.repositories.commentRepository, FilesystemCommentRepository);
      this.bindToken(THREAD_TOKENS.repositories.reactionRepository, FilesystemReactionRepository);
    }

    // prettier-ignore
    this.bindToken(THREAD_TOKENS.repositories.commentSubscriptionRepository, FilesystemCommentSubscriptionRepository);
    this.bindToken(THREAD_TOKENS.repositories.commentReportRepository, FilesystemCommentReportRepository);

    this.bindToken(THREAD_TOKENS.commands.createThreadHandler, CreateThreadHandler);
    this.bindToken(THREAD_TOKENS.commands.createCommentHandler, CreateCommentHandler);
    this.bindToken(THREAD_TOKENS.commands.editCommentHandler, EditCommentHandler);
    this.bindToken(THREAD_TOKENS.commands.setReactionHandler, SetReactionHandler);
    this.bindToken(THREAD_TOKENS.commands.setCommentSubscriptionHandler, SetCommentSubscriptionHandler);
    this.bindToken(THREAD_TOKENS.commands.reportCommentHandler, ReportCommentHandler);

    this.bindToken(THREAD_TOKENS.queries.getLastThreadsHandler, GetLastThreadsHandler);
    this.bindToken(THREAD_TOKENS.queries.getThreadHandler, GetThreadHandler);
    this.bindToken(THREAD_TOKENS.queries.getCommentHandler, GetCommentHandler);

    this.bindToken(
      THREAD_TOKENS.eventHandlers.createThreadCreatedNotificationsHandler,
      CreateThreadCreatedNotificationsHandler
    );
  }
}
