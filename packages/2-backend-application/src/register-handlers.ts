import { CommentService, DomainDependencies } from 'backend-domain';
import { ClassType } from 'shared';

import { Command, CommandHandler, CommandResult } from './cqs/command-handler';
import { IEventBus } from './cqs/event-bus';
import { Query, QueryHandler } from './cqs/query-handler';
import { ConfigService } from './interfaces/config.service';
import { EmailCompilerService } from './interfaces/email-compiler.service';
import { EmailSenderService } from './interfaces/email-sender.service';
import { FilesystemService } from './interfaces/filesystem.service';
import { LoggerService } from './interfaces/logger.service';
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

export type Services = DomainDependencies & {
  configService: ConfigService;
  loggerService: LoggerService;
  filesystemService: FilesystemService;
  emailCompilerService: EmailCompilerService;
  emailSenderService: EmailSenderService;
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
  services: Services,
  repositories: Repositories,
  eventBus: IEventBus,
) => {
  const { generatorService, cryptoService, dateService, filesystemService, emailCompilerService, emailSenderService, profileImageStoreService } = services;
  const { userRepository, threadRepository, commentRepository, commentReportRepository, reactionRepository } = repositories;

  // email
  registerCommand(SendEmailCommand, new SendEmailHandler(filesystemService, emailCompilerService, emailSenderService));

  // authentication
  registerCommand(LoginCommand, new LoginCommandHandler(userRepository));
  registerCommand(SignupCommand, new SignupCommandHandler(eventBus, userRepository, generatorService, cryptoService, dateService, profileImageStoreService));

  // account
  registerQuery(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  registerQuery(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  registerCommand(ValidateEmailAddressCommand, new ValidateEmailAddressHandler(userRepository));
  registerCommand(UpdateUserCommand, new UpdateUserHandler(userRepository));

  // user
  registerQuery(GetProfileImageQuery, new GetProfileImageHandler(profileImageStoreService));

  // thread
  registerQuery(GetLastThreadsQuery, new GetLastThreadsHandler(threadRepository));
  registerQuery(GetThreadQuery, new GetThreadHandler(threadRepository, commentRepository, reactionRepository));
  registerCommand(CreateThreadCommand, new CreateThreadHandler(generatorService, dateService, threadRepository));

  const commentService = new CommentService(generatorService);

  // comment
  registerQuery(GetCommentQuery, new GetCommentQueryHandler(commentRepository));
  registerCommand(CreateCommentCommand, new CreateCommentCommandHandler(generatorService, dateService, commentRepository));
  registerCommand(EditCommentCommand, new EditCommentCommandHandler(commentRepository));
  registerCommand(SetReactionCommand, new SetReactionCommandHandler(commentRepository, reactionRepository, commentService));
  registerCommand(ReportCommentCommand, new ReportCommentHandler(commentRepository, commentReportRepository, commentService));
}
