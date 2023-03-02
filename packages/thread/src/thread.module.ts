import { Module } from '@shakala/common';

import { CreateCommentHandler } from './commands/create-comment/create-comment';
import { CreateThreadHandler } from './commands/create-thread/create-thread';
import { EditCommentHandler } from './commands/edit-comment/edit-comment';
import { ReportCommentHandler } from './commands/report-comment/report-comment';
import { SetCommentSubscriptionHandler } from './commands/set-comment-subscription/set-comment-subscription';
import { SetReactionHandler } from './commands/set-reaction/set-reaction';
import { GetCommentHandler } from './queries/get-comment';
import { GetLastThreadsHandler } from './queries/get-last-threads';
import { GetThreadHandler } from './queries/get-thread';
import { FilesystemCommentRepository } from './repositories/comment/filesystem-comment.repository';
import { FilesystemCommentReportRepository } from './repositories/comment-report/filesystem-comment-report.repository';
import { FilesystemCommentSubscriptionRepository } from './repositories/comment-subscription/filesystem-comment-subscription.repository';
import { FilesystemReactionRepository } from './repositories/reaction/filesystem-reaction.repository';
import { FilesystemThreadRepository } from './repositories/thread/filesystem-thread.repository';
import { THREAD_TOKENS } from './tokens';

export class ThreadModule extends Module {
  async init() {
    this.bindToken(THREAD_TOKENS.repositories.threadRepository, FilesystemThreadRepository);
    this.bindToken(THREAD_TOKENS.repositories.commentRepository, FilesystemCommentRepository);
    this.bindToken(THREAD_TOKENS.repositories.reactionRepository, FilesystemReactionRepository);
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

    this.registerCommandHandler(THREAD_TOKENS.commands.createThreadHandler);
    this.registerCommandHandler(THREAD_TOKENS.commands.createCommentHandler);
    this.registerCommandHandler(THREAD_TOKENS.commands.editCommentHandler);
    this.registerCommandHandler(THREAD_TOKENS.commands.setReactionHandler);
    this.registerCommandHandler(THREAD_TOKENS.commands.setCommentSubscriptionHandler);
    this.registerCommandHandler(THREAD_TOKENS.commands.reportCommentHandler);

    this.registerQueryHandler(THREAD_TOKENS.queries.getLastThreadsHandler);
    this.registerQueryHandler(THREAD_TOKENS.queries.getThreadHandler);
    this.registerQueryHandler(THREAD_TOKENS.queries.getCommentHandler);
  }
}

export class TestThreadModule extends ThreadModule {}
