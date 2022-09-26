import { CommentService, DomainDependencies } from 'backend-domain';
import { ClassType } from 'shared';

import { Command, CommandHandler, CommandResult } from './cqs/command-handler';
import { IEventBus } from './cqs/event-bus';
import { Query, QueryHandler } from './cqs/query-handler';
import { EmailCompilerPort } from './interfaces/email-compiler.port';
import { EmailSenderPort } from './interfaces/email-sender.port';
import { FilesystemPort } from './interfaces/filesystem.port';
import { LoggerPort } from './interfaces/logger.port';
import {
  CommentRepository,
  ReactionRepository,
  ThreadRepository,
  UserRepository,
} from './interfaces/repositories';
import { CommentReportRepository } from './interfaces/repositories/comment-report.repository';
import { LoginCommand, LoginCommandHandler } from './modules/authentication/login.command';
import { SignupCommand, SignupCommandHandler } from './modules/authentication/signup.command';
import { SendEmailCommand, SendEmailHandler } from './modules/email/send-email.command';
import { CreateCommentCommand, CreateCommentCommandHandler } from './modules/thread/create-comment.command';
import { CreateThreadCommand, CreateThreadHandler } from './modules/thread/create-thread.command';
import { EditCommentCommand, EditCommentCommandHandler } from './modules/thread/edit-comment.command';
import { GetCommentQuery, GetCommentQueryHandler } from './modules/thread/get-comment.query';
import { GetLastThreadsHandler, GetLastThreadsQuery } from './modules/thread/get-last-threads.query';
import { GetThreadHandler, GetThreadQuery } from './modules/thread/get-thread.query';
import { ReportCommentCommand, ReportCommentHandler } from './modules/thread/report-comment.command';
import { SetReactionCommand, SetReactionCommandHandler } from './modules/thread/set-reaction.command';
import { GetProfileImageHandler, GetProfileImageQuery } from './modules/user/get-profile-image.query';
import { GetUserByEmailHandler, GetUserByEmailQuery } from './modules/user/get-user-by-email.query';
import { GetUserByIdHandler, GetUserByIdQuery } from './modules/user/get-user-by-id.query';
import { UpdateUserCommand, UpdateUserHandler } from './modules/user/update-user.command';
import {
  ValidateEmailAddressCommand,
  ValidateEmailAddressHandler,
} from './modules/user/validate-email-address.command';

export type ApplicationDependencies = DomainDependencies & {
  logger: LoggerPort;
  filesystem: FilesystemPort;
  emailCompiler: EmailCompilerPort;
  emailSender: EmailSenderPort;
};

export type Repositories = {
  userRepository: UserRepository;
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  reactionRepository: ReactionRepository;
  commentReportRepository: CommentReportRepository;
};

// prettier-ignore
export const registerHandlers = (
  registerCommand: <C extends Command>(command: ClassType<C>, handler: CommandHandler<C, CommandResult>) => void,
  registerQuery: <Q extends Query>(query: ClassType<Q>, handler: QueryHandler<Q, unknown>) => void,
  eventBus: IEventBus,
  repositories: Repositories,
  dependencies: ApplicationDependencies,
) => {
  const { generator, crypto, date, filesystem, emailCompiler, emailSender, profileImageStore } = dependencies;
  const { userRepository, threadRepository, commentRepository, commentReportRepository, reactionRepository } = repositories;

  // email
  registerCommand(SendEmailCommand, new SendEmailHandler(filesystem, emailCompiler, emailSender));

  // authentication
  registerCommand(LoginCommand, new LoginCommandHandler(userRepository));
  registerCommand(SignupCommand, new SignupCommandHandler(eventBus, userRepository, generator, crypto, date, profileImageStore));

  // account
  registerQuery(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  registerQuery(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  registerCommand(ValidateEmailAddressCommand, new ValidateEmailAddressHandler(userRepository));
  registerCommand(UpdateUserCommand, new UpdateUserHandler(userRepository));

  // user
  registerQuery(GetProfileImageQuery, new GetProfileImageHandler(profileImageStore));

  // thread
  registerQuery(GetLastThreadsQuery, new GetLastThreadsHandler(threadRepository));
  registerQuery(GetThreadQuery, new GetThreadHandler(threadRepository, commentRepository, reactionRepository));
  registerCommand(CreateThreadCommand, new CreateThreadHandler(generator, date, threadRepository));

  const commentService = new CommentService(generator);

  // comment
  registerQuery(GetCommentQuery, new GetCommentQueryHandler(commentRepository));
  registerCommand(CreateCommentCommand, new CreateCommentCommandHandler(generator, date, commentRepository));
  registerCommand(EditCommentCommand, new EditCommentCommandHandler(commentRepository));
  registerCommand(SetReactionCommand, new SetReactionCommandHandler(commentRepository, reactionRepository, commentService));
  registerCommand(ReportCommentCommand, new ReportCommentHandler(commentRepository, commentReportRepository, commentService));
}
