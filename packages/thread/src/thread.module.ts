import { Module } from '@shakala/common';

import { CreateCommentHandler } from './commands/create-comment/create-comment';
import { CreateThreadHandler } from './commands/create-thread/create-thread';
import { EditCommentHandler } from './commands/edit-comment/edit-comment';
import { ReportCommentHandler } from './commands/report-comment/report-comment';
import { SetCommentSubscriptionHandler } from './commands/set-comment-subscription/set-comment-subscription';
import { SetReactionHandler } from './commands/set-reaction/set-reaction';
import { FilesystemCommentRepository } from './repositories/comment/filesystem-comment.repository';
import { FilesystemCommentReportRepository } from './repositories/comment-report/filesystem-comment-report.repository';
import { FilesystemCommentSubscriptionRepository } from './repositories/comment-subscription/filesystem-comment-subscription.repository';
import { FilesystemReactionRepository } from './repositories/reaction/filesystem-reaction.repository';
import { FilesystemThreadRepository } from './repositories/thread/filesystem-thread.repository';
import { THREAD_TOKENS } from './tokens';

export class ThreadModule extends Module {
  async init() {
    this.bindToken(THREAD_TOKENS.threadRepository, FilesystemThreadRepository);
    this.bindToken(THREAD_TOKENS.commentRepository, FilesystemCommentRepository);
    this.bindToken(THREAD_TOKENS.reactionRepository, FilesystemReactionRepository);
    this.bindToken(THREAD_TOKENS.commentSubscriptionRepository, FilesystemCommentSubscriptionRepository);
    this.bindToken(THREAD_TOKENS.commentReportRepository, FilesystemCommentReportRepository);
    this.bindToken(THREAD_TOKENS.createThreadHandler, CreateThreadHandler);
    this.bindToken(THREAD_TOKENS.createCommentHandler, CreateCommentHandler);
    this.bindToken(THREAD_TOKENS.editCommentHandler, EditCommentHandler);
    this.bindToken(THREAD_TOKENS.setReactionHandler, SetReactionHandler);
    this.bindToken(THREAD_TOKENS.setCommentSubscriptionHandler, SetCommentSubscriptionHandler);
    this.bindToken(THREAD_TOKENS.reportCommentHandler, ReportCommentHandler);

    this.registerCommandHandler(THREAD_TOKENS.createThreadHandler);
    this.registerCommandHandler(THREAD_TOKENS.createCommentHandler);
    this.registerCommandHandler(THREAD_TOKENS.editCommentHandler);
    this.registerCommandHandler(THREAD_TOKENS.setReactionHandler);
    this.registerCommandHandler(THREAD_TOKENS.setCommentSubscriptionHandler);
    this.registerCommandHandler(THREAD_TOKENS.reportCommentHandler);
  }
}

export class TestThreadModule extends ThreadModule {}
