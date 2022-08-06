import { EntityManager } from '@mikro-orm/postgresql';
import {
  InMemoryUserRepository,
  InMemoryThreadRepository,
  InMemoryReactionRepository,
  InMemoryCommentRepository,
  GetUserByIdHandler,
  GetUserByEmailHandler,
  LoginCommandHandler,
  SignupCommandHandler,
  GetLastThreadsHandler,
  GetThreadHandler,
  GetCommentQueryHandler,
  CreateCommentCommandHandler,
  UpdateCommentCommandHandler,
  SetReactionCommandHandler,
  CommentRepository,
  ReactionRepository,
  ThreadRepository,
  UserRepository,
  createUser,
  GeneratorService,
  CommandHandler,
  QueryHandler,
  CommandResult,
  Command,
  Query,
  CreateCommentCommand,
  GetCommentQuery,
  LoginCommand,
  SetReactionCommand,
  SignupCommand,
  UpdateCommentCommand,
  GetUserByIdQuery,
  GetUserByEmailQuery,
  GetLastThreadsQuery,
  GetThreadQuery,
  CreateThreadCommand,
  CreateThreadHandler,
} from 'backend-application';
import { DateService, CryptoService } from 'backend-domain';
import { ClassType } from 'shared';

import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { ThreadController } from './controllers/thread/thread.controller';
import threadChoucroute from './fixtures/thread-choucroute';
import threadFacebookZetetique from './fixtures/thread-facebook-zetetique';
import threadFlatEarth from './fixtures/thread-flat-earth';
import {
  MathRandomGeneratorService,
  RealDateService,
  BcryptService,
  ValidationService,
  ExpressSessionService,
  QueryBus,
  SessionService,
  CommandBus,
  Controller,
} from './infrastructure';
import { ConfigService, EnvConfigService } from './infrastructure/services/env-config.service';
import {
  SqlUserRepository,
  SqlThreadRepository,
  SqlReactionRepository,
  SqlCommentRepository,
} from './persistence';

const users = [
  createUser({
    id: 'user1',
    email: 'nils@nils.cx',
    // cspell:disable
    hashedPassword: '$2b$10$B0Bfw0ypnDMW1hM/x7L0COD9MoCENH5mSwgda1aAme49h9.du7exu',
    nick: 'nilscox',
  }),
];

const threads = [
  //
  threadFacebookZetetique.thread,
  threadFlatEarth.thread,
  threadChoucroute.thread,
];

const comments = [
  //
  ...threadFacebookZetetique.comments,
  ...threadFlatEarth.comments,
  ...threadChoucroute.comments,
];

export type Repositories = {
  userRepository: UserRepository;
  threadRepository: ThreadRepository;
  reactionRepository: ReactionRepository;
  commentRepository: CommentRepository;
};

const instantiateInMemoryRepositories = (): Repositories => {
  const userRepository = new InMemoryUserRepository(users);
  const threadRepository = new InMemoryThreadRepository(threads);
  const reactionRepository = new InMemoryReactionRepository();
  const commentRepository = new InMemoryCommentRepository(reactionRepository, comments);

  return {
    userRepository,
    threadRepository,
    reactionRepository,
    commentRepository,
  };
};

instantiateInMemoryRepositories;

export const instantiateRepositories = (em: EntityManager): Repositories => {
  const userRepository = new SqlUserRepository(em);
  const threadRepository = new SqlThreadRepository(em);
  const reactionRepository = new SqlReactionRepository(em);
  const commentRepository = new SqlCommentRepository(em);

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
  commands.set(UpdateCommentCommand, new UpdateCommentCommandHandler(dateService, commentRepository, userRepository));

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
