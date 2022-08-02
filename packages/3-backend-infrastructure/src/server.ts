import {
  CreateCommentCommand,
  CreateCommentCommandHandler,
  createUser,
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
  SetReactionCommand,
  SetReactionCommandHandler,
  SignupCommand,
  SignupCommandHandler,
  UpdateCommentCommand,
  UpdateCommentCommandHandler,
} from 'backend-application';
import cors from 'cors';
import express, { json } from 'express';
import session from 'express-session';

import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { ThreadController } from './controllers/thread/thread.controller';
import threadChoucroute from './fixtures/thread-choucroute';
import threadFacebookZetetique from './fixtures/thread-facebook-zetetique';
import threadFlatEarth from './fixtures/thread-flat-earth';
import {
  BcryptService,
  ExpressSessionService,
  MathRandomGeneratorService,
  RealCommandBus,
  RealDateService,
  RealQueryBus,
  ValidationService,
} from './infrastructure';
import { EnvConfigService } from './infrastructure/services/env-config.service';

const users = [
  createUser({
    id: 'user1',
    email: 'nils@nils.cx',
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

export class Server {
  protected app = express();

  protected userRepository = new InMemoryUserRepository(users);
  protected threadRepository = new InMemoryThreadRepository(threads);
  protected reactionRepository = new InMemoryReactionRepository();
  protected commentRepository = new InMemoryCommentRepository(this.reactionRepository, comments);

  protected configService = new EnvConfigService();
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
  protected getThreadHandler = new GetThreadHandler(
    this.threadRepository,
    this.commentRepository,
    this.reactionRepository,
  );
  protected getCommentHandler = new GetCommentQueryHandler(this.commentRepository);
  protected createCommentHandler = new CreateCommentCommandHandler(
    this.generatorService,
    this.dateService,
    this.commentRepository,
    this.userRepository,
  );
  protected updateCommentHandler = new UpdateCommentCommandHandler(
    this.dateService,
    this.commentRepository,
    this.userRepository,
  );
  protected setReactionHandler = new SetReactionCommandHandler(
    this.generatorService,
    this.reactionRepository,
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
    const corsConfig = this.configService.cors();
    const sessionConfig = this.configService.session();

    this.app.use(json());

    this.app.use(
      cors({
        origin: corsConfig.reflectOrigin,
        credentials: true,
      }),
    );

    this.app.use(
      session({
        secret: sessionConfig.secret,
        cookie: {
          secure: sessionConfig.secure,
          httpOnly: true,
        },
        resave: false,
        saveUninitialized: true,
      }),
    );
  }

  private registerHandlers() {
    this.queryBus.register(GetUserByEmailQuery, this.getUserByEmailHandler);
    this.queryBus.register(GetUserByIdQuery, this.getUserByIdHandler);
    this.commandBus.register(LoginCommand, this.loginCommandHandler);
    this.commandBus.register(SignupCommand, this.signupCommandHandler);

    this.queryBus.register(GetLastThreadsQuery, this.getLastThreadsHandler);
    this.queryBus.register(GetThreadQuery, this.getThreadHandler);
    this.queryBus.register(GetCommentQuery, this.getCommentHandler);
    this.commandBus.register(CreateCommentCommand, this.createCommentHandler);
    this.commandBus.register(UpdateCommentCommand, this.updateCommentHandler);
    this.commandBus.register(SetReactionCommand, this.setReactionHandler);
  }

  private configureControllers() {
    this.authenticationController.configure(this.app);
    this.threadController.configure(this.app);
  }
}
