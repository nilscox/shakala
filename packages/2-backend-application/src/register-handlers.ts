import { CommentService, DomainDependencies } from 'backend-domain';
import { ClassType } from 'shared';

// prettier-ignore
import { Command, CommandHandler, CommandResult, IEventBus, Query, QueryHandler } from './cqs';
// prettier-ignore
import { CommentRepository, ReactionRepository, ThreadRepository, UserRepository, CommentReportRepository, EmailCompilerPort, EmailSenderPort, FilesystemPort, LoggerPort } from './interfaces';
// prettier-ignore
import { SignupCommand, SignupCommandHandler, LoginCommand, LoginCommandHandler, SignOutCommand, SignOutCommandHandler } from './modules/authentication';
// prettier-ignore
import { SendEmailCommand, SendEmailHandler } from './modules/email';
// prettier-ignore
import { CreateCommentCommand, CreateCommentCommandHandler, CreateThreadCommand, CreateThreadHandler, EditCommentCommand, EditCommentCommandHandler, GetCommentQuery, GetCommentQueryHandler, GetLastThreadsHandler, GetLastThreadsQuery, GetThreadHandler, GetThreadQuery, ReportCommentCommand, ReportCommentHandler, SetReactionCommand, SetReactionCommandHandler } from './modules/thread';
// prettier-ignore
import { GetProfileImageHandler, GetProfileImageQuery, GetUserByEmailHandler, GetUserByEmailQuery, GetUserByIdHandler, GetUserByIdQuery, UpdateUserCommand, UpdateUserHandler, ValidateEmailAddressCommand, ValidateEmailAddressHandler } from './modules/user';

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
  registerCommand(LoginCommand, new LoginCommandHandler(eventBus, userRepository));
  registerCommand(SignupCommand, new SignupCommandHandler(eventBus, userRepository, generator, crypto, date, profileImageStore));
  registerCommand(SignOutCommand, new SignOutCommandHandler(eventBus));

  // account
  registerQuery(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  registerQuery(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  registerCommand(ValidateEmailAddressCommand, new ValidateEmailAddressHandler(eventBus, userRepository));
  registerCommand(UpdateUserCommand, new UpdateUserHandler(eventBus, userRepository));

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
