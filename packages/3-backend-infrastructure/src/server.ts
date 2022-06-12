import {
  CreateCommentCommand,
  CreateCommentCommandHandler,
  createComment,
  createThread,
  createUser,
  GetThreadQuery,
  GetThreadHandler,
  GetUserByEmailHandler,
  GetUserByEmailQuery,
  GetUserByIdHandler,
  GetUserByIdQuery,
  InMemoryCommentRepository,
  InMemoryThreadRepository,
  InMemoryUserRepository,
  LoginCommand,
  LoginCommandHandler,
  SignupCommand,
  SignupCommandHandler,
  GetLastThreadsHandler,
  GetLastThreadsQuery,
} from 'backend-application';
import cors from 'cors';
import express, { ErrorRequestHandler, json } from 'express';
import session from 'express-session';

import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { ThreadController } from './controllers/thread/thread.controller';
import {
  RealCommandBus,
  RealQueryBus,
  BcryptService,
  MathRandomGeneratorService,
  RealDateService,
  ExpressSessionService,
  ValidationService,
  Response,
} from './infrastructure';

const users = [
  createUser({
    id: 'user1',
    email: 'nils@nils.cx',
    hashedPassword: '$2b$10$B0Bfw0ypnDMW1hM/x7L0COD9MoCENH5mSwgda1aAme49h9.du7exu',
    nick: 'nilscox',
  }),
];

const threads = [
  createThread({
    id: 'thread1',
  }),
];

const comments = [
  createComment({
    id: 'comment1',
    threadId: 'thread1',
  }),
  createComment({
    threadId: 'thread1',
    parentId: 'comment1',
  }),
];

export class Server {
  protected app = express();

  protected userRepository = new InMemoryUserRepository(users);
  protected threadRepository = new InMemoryThreadRepository(threads);
  protected commentRepository = new InMemoryCommentRepository(comments);

  protected generatorService = new MathRandomGeneratorService();
  protected dateService = new RealDateService();
  protected cryptoService = new BcryptService();
  protected validationService = new ValidationService();

  protected queryBus = new RealQueryBus();
  protected commandBus = new RealCommandBus();

  protected getUserByIdHandler = new GetUserByIdHandler(this.userRepository);
  protected getUserByEmailHandler = new GetUserByEmailHandler(this.userRepository);
  protected loginCommandHandler = new LoginCommandHandler(
    this.userRepository,
    this.cryptoService,
    this.dateService,
  );
  protected signupCommandHandler = new SignupCommandHandler(
    this.userRepository,
    this.generatorService,
    this.cryptoService,
    this.dateService,
  );

  protected getLastThreadsHandler = new GetLastThreadsHandler(this.threadRepository);
  protected getThreadHandler = new GetThreadHandler(this.threadRepository, this.commentRepository);
  protected createCommentCommandHandler = new CreateCommentCommandHandler(
    this.generatorService,
    this.dateService,
    this.commentRepository,
    this.userRepository,
  );

  protected sessionService = new ExpressSessionService(this.queryBus);

  protected authenticationController = new AuthenticationController(
    this.validationService,
    this.sessionService,
    this.queryBus,
    this.commandBus,
  );

  protected threadController = new ThreadController(
    this.queryBus,
    this.commandBus,
    this.sessionService,
    this.validationService,
  );

  constructor() {
    this.configureDefaultMiddlewares();
    this.registerHandlers();
    this.configureControllers();
  }

  start() {
    this.app.listen(3000, () => {
      console.info('server listening on port 3000');
    });
  }

  private configureDefaultMiddlewares() {
    this.app.use(json());
    this.app.use(cors({ origin: true }));
    this.app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
  }

  private registerHandlers() {
    this.queryBus.register(GetUserByEmailQuery, this.getUserByEmailHandler);
    this.queryBus.register(GetUserByIdQuery, this.getUserByIdHandler);
    this.commandBus.register(LoginCommand, this.loginCommandHandler);
    this.commandBus.register(SignupCommand, this.signupCommandHandler);

    this.queryBus.register(GetLastThreadsQuery, this.getLastThreadsHandler);
    this.queryBus.register(GetThreadQuery, this.getThreadHandler);
    this.commandBus.register(CreateCommentCommand, this.createCommentCommandHandler);
  }

  private configureControllers() {
    this.authenticationController.configure(this.app);
    this.threadController.configure(this.app);
  }
}
