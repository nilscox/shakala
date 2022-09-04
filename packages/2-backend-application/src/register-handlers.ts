import { CommentService, CryptoService, DateService, GeneratorService } from 'backend-domain';
import { ClassType } from 'shared';

import { LoginCommand, LoginCommandHandler } from './authentication/login.command';
import { SignupCommand, SignupCommandHandler } from './authentication/signup.command';
import { Command, CommandHandler, CommandResult } from './cqs/command-handler';
import { Query, QueryHandler } from './cqs/query-handler';
import { ConfigService } from './interfaces/config.service';
import { LoggerService } from './interfaces/logger.service';
import {
  CommentRepository,
  ReactionRepository,
  ThreadRepository,
  UserRepository,
} from './interfaces/repositories';
import { CreateCommentCommand, CreateCommentCommandHandler } from './thread/create-comment.command';
import { CreateThreadCommand, CreateThreadHandler } from './thread/create-thread.command';
import { EditCommentCommand, EditCommentCommandHandler } from './thread/edit-comment.command';
import { GetCommentQuery, GetCommentQueryHandler } from './thread/get-comment.query';
import { GetLastThreadsHandler, GetLastThreadsQuery } from './thread/get-last-threads.query';
import { GetThreadHandler, GetThreadQuery } from './thread/get-thread.query';
import { SetReactionCommand, SetReactionCommandHandler } from './thread/set-reaction.command';
import { GetUserByEmailHandler, GetUserByEmailQuery } from './user/get-user-by-email.query';
import { GetUserByIdHandler, GetUserByIdQuery } from './user/get-user-by-id.query';

export type Services = {
  configService: ConfigService;
  loggerService: LoggerService;
  generatorService: GeneratorService;
  dateService: DateService;
  cryptoService: CryptoService;
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
) => {
  const { generatorService, cryptoService, dateService } = services;
  const { userRepository, threadRepository, commentRepository, reactionRepository } = repositories;

  // authentication
  registerQuery(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  registerQuery(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  registerCommand(LoginCommand, new LoginCommandHandler(userRepository));
  registerCommand(SignupCommand, new SignupCommandHandler(userRepository, generatorService, cryptoService, dateService));

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
