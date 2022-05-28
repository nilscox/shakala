import { Container } from 'inversify';

import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { CryptoService, BcryptService, CryptoServiceToken } from './common/crypto.service';
import { DateService, DateServiceToken, RealDateService } from './common/date.service';
import {
  GeneratorService,
  GeneratorServiceToken,
  MathRandomGeneratorService,
} from './common/generator.service';
import { CookieSessionService, SessionService, SessionServiceToken } from './common/session.service';
import { ValidationService } from './common/validation.service';
import { CommentEntity } from './data/comment/comment.entity';
import { CommentRepositoryToken } from './data/comment/comment.repository';
import { InMemoryCommentRepository } from './data/comment/in-memory-comment.repository';
import { InMemoryThreadRepository } from './data/thread/in-memory-thread.repository';
import { ThreadEntity } from './data/thread/thread.entity';
import { ThreadRepositoryToken } from './data/thread/thread.repository';
import { InMemoryUserRepository } from './data/user/in-memory-user.repository';
import { UserEntity } from './data/user/user.entity';
import { UserRepositoryToken } from './data/user/user.repository';
import threadFacebookZetetique from './fixtures/thread-facebook-zetetique';
import threadFlatEarth from './fixtures/thread-flat-earth';
import { createUserEntity } from './test/factories';
import { CommentService } from './thread/comment.service';
import { ThreadController } from './thread/thread.controller.server';
import { ThreadService } from './thread/thread.service';
import { UserService } from './user/user.service';

const nilscox = createUserEntity({
  id: '42',
  email: 'nils@nils.cx',
  hashedPassword: '$2b$10$B0Bfw0ypnDMW1hM/x7L0COD9MoCENH5mSwgda1aAme49h9.du7exu', // tatata123
  nick: 'nilscox',
});

type Data = {
  threads: ThreadEntity[];
  comments: CommentEntity[];
  users: UserEntity[];
};

const data: Data = {
  threads: [threadFacebookZetetique.thread, threadFlatEarth.thread],
  comments: [...threadFacebookZetetique.comments, ...threadFlatEarth.comments],
  users: [...threadFacebookZetetique.users, ...threadFlatEarth.users, nilscox],
};

declare global {
  var _data: typeof data;
}

if (!global._data) {
  global._data = data;
}

const container = new Container();

container.bind('comments').toConstantValue(global._data.comments);
container.bind('threads').toConstantValue(global._data.threads);
container.bind('users').toConstantValue(global._data.users);

container.bind('session.secure').toConstantValue(process.env.NODE_ENV === 'production');
container.bind('session.secret').toConstantValue('secret');
container.bind('session.sameSite').toConstantValue('lax');
container.bind('session.maxAge').toConstantValue(60 * 60 * 24 * 30);
container.bind('session.httpOnly').toConstantValue(true);

container.bind(CommentRepositoryToken).to(InMemoryCommentRepository);
container.bind(ThreadRepositoryToken).to(InMemoryThreadRepository);
container.bind(UserRepositoryToken).to(InMemoryUserRepository);

container.bind(ValidationService).toSelf();
container.bind<DateService>(DateServiceToken).to(RealDateService);
container.bind<SessionService>(SessionServiceToken).to(CookieSessionService);
container.bind<CryptoService>(CryptoServiceToken).to(BcryptService);
container.bind<GeneratorService>(GeneratorServiceToken).to(MathRandomGeneratorService);

container.bind(UserService).toSelf();

container.bind(AuthenticationService).toSelf();
container.bind(AuthenticationController).toSelf();

container.bind(CommentService).toSelf();
container.bind(ThreadService).toSelf();
container.bind(ThreadController).toSelf();

export default container;
