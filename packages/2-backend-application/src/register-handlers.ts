import { CommentService, DomainDependencies, UserActivityService } from '@shakala/backend-domain';
import { ClassType } from '@shakala/shared';

// prettier-ignore
import { Command, CommandHandler, CommandResult, IEventBus, Query, QueryHandler } from './cqs';
// prettier-ignore
import { CommentReportRepository, CommentRepository, CommentSubscriptionRepository, EmailCompilerPort, EmailSenderPort, FilesystemPort, LoggerPort, NotificationRepository, ReactionRepository, ThreadRepository, UserActivityRepository, UserRepository } from './interfaces';
// prettier-ignore
import { LoginCommand, LoginCommandHandler, SignOutCommand, SignOutCommandHandler, SignupCommand, SignupCommandHandler } from './modules/authentication';
// prettier-ignore
import { SendEmailCommand, SendEmailHandler } from './modules/email';
import {
  CreateNotificationCommand,
  CreateNotificationHandler,
  MarkNotificationAsSeenCommand,
  MarkNotificationAsSeenHandler,
} from './modules/notifications';
// prettier-ignore
import { CreateCommentCommand, CreateCommentCommandHandler, CreateCommentReplyNotificationsCommand, CreateCommentReplyNotificationsHandler, CreateThreadCommand, CreateThreadHandler, EditCommentCommand, EditCommentCommandHandler, GetCommentQuery, GetCommentQueryHandler, GetLastThreadsHandler, GetLastThreadsQuery, GetThreadHandler, GetThreadQuery, ReportCommentCommand, ReportCommentHandler, SetCommentSubscriptionCommand, SetCommentSubscriptionCommandHandler, SetReactionCommand, SetReactionCommandHandler } from './modules/thread';
// prettier-ignore
import { CreateUserActivityCommand, CreateUserActivityHandler, GetProfileImageHandler, GetProfileImageQuery, GetUserByEmailHandler, GetUserByEmailQuery, GetUserByIdHandler, GetUserByIdQuery, UpdateUserCommand, UpdateUserHandler, ValidateEmailAddressCommand, ValidateEmailAddressHandler } from './modules/user';
// prettier-ignore
import { GetUserActivitiesHandler, GetUserActivitiesQuery } from './modules/user/get-user-activities/get-user-activities.query';

export type ApplicationDependencies = DomainDependencies & {
  logger: LoggerPort;
  filesystem: FilesystemPort;
  emailCompiler: EmailCompilerPort;
  emailSender: EmailSenderPort;
};

export type Repositories = {
  userRepository: UserRepository;
  userActivityRepository: UserActivityRepository;
  notificationRepository: NotificationRepository;
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  reactionRepository: ReactionRepository;
  commentReportRepository: CommentReportRepository;
  commentSubscriptionRepository: CommentSubscriptionRepository;
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
  const { userRepository, userActivityRepository, notificationRepository, threadRepository, commentRepository, commentReportRepository, commentSubscriptionRepository, reactionRepository } = repositories;

  const commentService = new CommentService(generator);
  const userActivityService = new UserActivityService(generator, date);

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

  // profile
  registerQuery(GetUserActivitiesQuery, new GetUserActivitiesHandler(userActivityRepository));
  registerCommand(CreateUserActivityCommand, new CreateUserActivityHandler(userActivityRepository, threadRepository, commentRepository, userActivityService));

  // thread
  registerQuery(GetLastThreadsQuery, new GetLastThreadsHandler(threadRepository));
  registerQuery(GetThreadQuery, new GetThreadHandler(threadRepository, commentRepository, reactionRepository, commentSubscriptionRepository));
  registerCommand(CreateThreadCommand, new CreateThreadHandler(eventBus, generator, date, threadRepository));

  // comment
  registerQuery(GetCommentQuery, new GetCommentQueryHandler(commentRepository));
  registerCommand(CreateCommentCommand, new CreateCommentCommandHandler(eventBus, generator, date, commentRepository));
  registerCommand(EditCommentCommand, new EditCommentCommandHandler(eventBus, commentRepository));
  registerCommand(SetReactionCommand, new SetReactionCommandHandler(eventBus, commentRepository, reactionRepository, commentService));
  registerCommand(ReportCommentCommand, new ReportCommentHandler(eventBus, commentRepository, commentReportRepository, commentService));
  registerCommand(SetCommentSubscriptionCommand, new SetCommentSubscriptionCommandHandler(generator, eventBus, userRepository, commentRepository, commentSubscriptionRepository));
  registerCommand(CreateCommentReplyNotificationsCommand, new CreateCommentReplyNotificationsHandler(generator, date, threadRepository, commentRepository, commentSubscriptionRepository, notificationRepository));

  // notification
  registerCommand(CreateNotificationCommand, new CreateNotificationHandler(generator, date, notificationRepository));
  registerCommand(MarkNotificationAsSeenCommand, new MarkNotificationAsSeenHandler(date, notificationRepository));
}
