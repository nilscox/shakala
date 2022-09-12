import { CommentService, CryptoService, DateService, GeneratorService } from 'backend-domain';
import { ClassType } from 'shared';

import { Command, CommandHandler, CommandResult } from './cqs/command-handler';
import { IEventBus } from './cqs/event-bus';
import { Query, QueryHandler } from './cqs/query-handler';
import { ConfigService } from './interfaces/config.service';
import { EmailService } from './interfaces/email.service';
import { FilesystemService } from './interfaces/filesystem.service';
import { LoggerService } from './interfaces/logger.service';
import {
  CommentRepository,
  ReactionRepository,
  ThreadRepository,
  UserRepository,
} from './interfaces/repositories';
import { LoginCommand, LoginCommandHandler } from './modules/authentication/login.command';
import { SignupCommand, SignupCommandHandler } from './modules/authentication/signup.command';
import { SendEmailCommand, SendEmailHandler } from './modules/email/send-email.command';
import { CreateCommentCommand, CreateCommentCommandHandler } from './modules/thread/create-comment.command';
import { CreateThreadCommand, CreateThreadHandler } from './modules/thread/create-thread.command';
import { EditCommentCommand, EditCommentCommandHandler } from './modules/thread/edit-comment.command';
import { GetCommentQuery, GetCommentQueryHandler } from './modules/thread/get-comment.query';
import { GetLastThreadsHandler, GetLastThreadsQuery } from './modules/thread/get-last-threads.query';
import { GetThreadHandler, GetThreadQuery } from './modules/thread/get-thread.query';
import { SetReactionCommand, SetReactionCommandHandler } from './modules/thread/set-reaction.command';
import { GetUserByEmailQuery, GetUserByEmailHandler } from './modules/user/get-user-by-email.query';
import { GetUserByIdQuery, GetUserByIdHandler } from './modules/user/get-user-by-id.query';

export type Services = {
  configService: ConfigService;
  loggerService: LoggerService;
  generatorService: GeneratorService;
  dateService: DateService;
  cryptoService: CryptoService;
  filesystemService: FilesystemService;
  emailService: EmailService;
};

export type Repositories = {
  userRepository: UserRepository;
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  reactionRepository: ReactionRepository;
};

// prettier-ignore
export const registerHandlers = (
  registerCommand: <C extends Command>(command: ClassType<C>, handler: CommandHandler<C, CommandResult>) => void,
  registerQuery: <Q extends Query>(query: ClassType<Q>, handler: QueryHandler<Q, unknown>) => void,
  services: Services,
  repositories: Repositories,
  eventBus: IEventBus,
) => {
  const { generatorService, cryptoService, dateService, filesystemService, emailService } = services;
  const { userRepository, threadRepository, commentRepository, reactionRepository } = repositories;

  // email
  registerCommand(SendEmailCommand, new SendEmailHandler(filesystemService, emailService));

  // authentication
  registerQuery(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  registerQuery(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  registerCommand(LoginCommand, new LoginCommandHandler(userRepository));
  registerCommand(SignupCommand, new SignupCommandHandler(eventBus, userRepository, generatorService, cryptoService, dateService));

  // thread
  registerQuery(GetLastThreadsQuery, new GetLastThreadsHandler(threadRepository));
  registerQuery(GetThreadQuery, new GetThreadHandler(threadRepository, commentRepository, reactionRepository));
  registerCommand(CreateThreadCommand, new CreateThreadHandler(generatorService, dateService, userRepository, threadRepository));

  const commentService = new CommentService(generatorService);

  // comment
  registerQuery(GetCommentQuery, new GetCommentQueryHandler(commentRepository));
  registerCommand(CreateCommentCommand, new CreateCommentCommandHandler(generatorService, dateService, commentRepository, userRepository));
  registerCommand(EditCommentCommand, new EditCommentCommandHandler(commentRepository, userRepository));
  registerCommand(SetReactionCommand, new SetReactionCommandHandler(userRepository, commentRepository, reactionRepository, commentService));
}
