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
  EditCommentCommand,
  EditCommentCommandHandler,
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
  UserRepository,
} from 'backend-application';
import { CryptoService, DateService, GeneratorService } from 'backend-domain';
import { ClassType } from 'shared';

import {
  BcryptService,
  ExpressSessionService,
  MathRandomGeneratorService,
  QueryBus,
  RealCommandBus,
  RealDateService,
  RealQueryBus,
  SessionService,
  ValidationService,
} from './infrastructure';
import { ConfigService, EnvConfigService } from './infrastructure/services/config.service';
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
): Repositories => ({
  userRepository: new SqlUserRepository(em),
  threadRepository: new SqlThreadRepository(em),
  reactionRepository: new SqlReactionRepository(em),
  commentRepository: new SqlCommentRepository(em, generatorService, dateService),
});

export type Services = {
  configService: ConfigService;
  generatorService: GeneratorService;
  dateService: DateService;
  cryptoService: CryptoService;
  validationService: ValidationService;
  sessionService: SessionService;
};

export const instantiateServices = (queryBus: QueryBus): Services => ({
  configService: new EnvConfigService(),
  generatorService: new MathRandomGeneratorService(),
  dateService: new RealDateService(),
  cryptoService: new BcryptService(),
  validationService: new ValidationService(),
  sessionService: new ExpressSessionService(queryBus),
});

export type CommandHandlers = Map<ClassType<Command>, CommandHandler<unknown, CommandResult>>;
export type QueryHandlers = Map<ClassType<Query>, QueryHandler<unknown, unknown>>;

// prettier-ignore
export const registerHandlers = (
  queryBus: RealQueryBus,
  commandBus: RealCommandBus,
  { generatorService, cryptoService, dateService }: Services,
  { userRepository, threadRepository, commentRepository, reactionRepository }: Repositories,
) => {
  // authentication
  queryBus.register(GetUserByIdQuery, new GetUserByIdHandler(userRepository));
  queryBus.register(GetUserByEmailQuery, new GetUserByEmailHandler(userRepository));
  commandBus.register(LoginCommand, new LoginCommandHandler(userRepository, cryptoService, dateService));
  commandBus.register(SignupCommand, new SignupCommandHandler(userRepository, generatorService, cryptoService, dateService));

  // thread
  queryBus.register(GetLastThreadsQuery, new GetLastThreadsHandler(threadRepository));
  queryBus.register(GetThreadQuery, new GetThreadHandler(threadRepository, commentRepository, reactionRepository));
  commandBus.register(CreateThreadCommand, new CreateThreadHandler(generatorService, dateService, userRepository, threadRepository));

  // comment
  queryBus.register(GetCommentQuery, new GetCommentQueryHandler(commentRepository));
  commandBus.register(CreateCommentCommand, new CreateCommentCommandHandler(generatorService, dateService, commentRepository, userRepository));
  commandBus.register(EditCommentCommand, new EditCommentCommandHandler(commentRepository, userRepository));
  commandBus.register(SetReactionCommand, new SetReactionCommandHandler(generatorService, reactionRepository));
};
