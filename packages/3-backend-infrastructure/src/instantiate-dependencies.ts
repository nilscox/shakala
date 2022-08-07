import { EntityManager } from '@mikro-orm/postgresql';
import {
  Command,
  CommandHandler,
  CommandResult,
  CommentRepository,
  CreateCommentCommand,
  CreateCommentCommandHandler,
  CreateThreadCommand,
  CreateThreadHandler,
  GetCommentQuery,
  GetCommentQueryHandler,
  GetLastThreadsHandler,
  GetLastThreadsQuery,
  GetThreadHandler,
  GetThreadQuery,
  GetUserByEmailHandler,
  GetUserByEmailQuery,
  GetUserByIdHandler,
  GetUserByIdQuery,
  InMemoryCommentRepository,
  InMemoryReactionRepository,
  InMemoryThreadRepository,
  InMemoryUserRepository,
  LoginCommand,
  LoginCommandHandler,
  Query,
  QueryHandler,
  ReactionRepository,
  SetReactionCommand,
  SetReactionCommandHandler,
  SignupCommand,
  SignupCommandHandler,
  ThreadRepository,
  EditCommentCommand,
  EditCommentCommandHandler,
  UserRepository,
} from 'backend-application';
import { CryptoService, DateService, GeneratorService } from 'backend-domain';
import { ClassType } from 'shared';

import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { ThreadController } from './controllers/thread/thread.controller';
import {
  BcryptService,
  CommandBus,
  Controller,
  ExpressSessionService,
  MathRandomGeneratorService,
  QueryBus,
  RealDateService,
  SessionService,
  ValidationService,
} from './infrastructure';
import { ConfigService, EnvConfigService } from './infrastructure/services/env-config.service';
import {
  SqlCommentRepository,
  SqlReactionRepository,
  SqlThreadRepository,
  SqlUserRepository,
} from './persistence';

export type Repositories = {
  userRepository: UserRepository;
  threadRepository: ThreadRepository;
  reactionRepository: ReactionRepository;
  commentRepository: CommentRepository;
};

const instantiateInMemoryRepositories = (): Repositories => {
  const userRepository = new InMemoryUserRepository([]);
  const threadRepository = new InMemoryThreadRepository([]);
  const reactionRepository = new InMemoryReactionRepository();
  const commentRepository = new InMemoryCommentRepository(reactionRepository, []);

  return {
    userRepository,
    threadRepository,
    reactionRepository,
    commentRepository,
  };
};

instantiateInMemoryRepositories;

export const instantiateRepositories = (
  em: EntityManager,
  { generatorService, dateService }: Services,
): Repositories => {
  const userRepository = new SqlUserRepository(em);
  const threadRepository = new SqlThreadRepository(em);
  const reactionRepository = new SqlReactionRepository(em);
  const commentRepository = new SqlCommentRepository(em, generatorService, dateService);

  return {
    userRepository,
    threadRepository,
    reactionRepository,
    commentRepository,
  };
};

export type Services = {
  configService: ConfigService;
  generatorService: GeneratorService;
  dateService: DateService;
  cryptoService: CryptoService;
  validationService: ValidationService;
  sessionService: SessionService;
};

export const instantiateServices = (queryBus: QueryBus): Services => {
  const configService = new EnvConfigService();
  const generatorService = new MathRandomGeneratorService();
  const dateService = new RealDateService();
  const cryptoService = new BcryptService();
  const validationService = new ValidationService();
  const sessionService = new ExpressSessionService(queryBus);

  return {
    configService,
    generatorService,
    dateService,
    cryptoService,
    validationService,
    sessionService,
  };
};

export type CommandHandlers = Map<ClassType<Command>, CommandHandler<unknown, CommandResult>>;
export type QueryHandlers = Map<ClassType<Query>, QueryHandler<unknown, unknown>>;

// prettier-ignore
export const instantiateCommandAndQueries = (
  { userRepository, threadRepository, commentRepository, reactionRepository }: Repositories,
  { generatorService, cryptoService, dateService }: Services,
) => {
  const commands: CommandHandlers = new Map();
  const queries: QueryHandlers = new Map();

  // authentication
  queries.set(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  queries.set(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  commands.set(LoginCommand, new LoginCommandHandler(userRepository, cryptoService, dateService));
  commands.set(SignupCommand, new SignupCommandHandler(userRepository, generatorService, cryptoService, dateService));

  // thread
  queries.set(GetLastThreadsQuery, new GetLastThreadsHandler(threadRepository));
  queries.set(GetThreadQuery, new GetThreadHandler(threadRepository, commentRepository, reactionRepository));
  commands.set(CreateThreadCommand, new CreateThreadHandler(generatorService, dateService, userRepository, threadRepository));

  // comment
  queries.set(GetCommentQuery, new GetCommentQueryHandler(commentRepository));
  commands.set(CreateCommentCommand, new CreateCommentCommandHandler(generatorService, dateService, commentRepository, userRepository));
  commands.set(EditCommentCommand, new EditCommentCommandHandler(commentRepository, userRepository));

  // reaction
  commands.set(SetReactionCommand, new SetReactionCommandHandler(generatorService, reactionRepository));

  return { commands, queries };
};

export type Controllers = Controller[];

export const instantiateControllers = (
  commandBus: CommandBus,
  queryBus: QueryBus,
  { validationService, sessionService }: Services,
) => [
  new AuthenticationController(validationService, sessionService, queryBus, commandBus),
  new ThreadController(queryBus, commandBus, sessionService, validationService),
];
