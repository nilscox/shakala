import {
  factories,
  StubCryptoService,
  StubDateService,
  StubGeneratorService,
  UserCreatedEvent,
} from 'backend-domain';

import { StubEventBus } from '../../utils/stub-event-bus';
import { InMemoryUserRepository } from '../user/user.in-memory-repository';

import {
  EmailAlreadyExistsError,
  NickAlreadyExistsError,
  SignupCommand,
  SignupCommandHandler,
} from './signup.command';

describe('SignupCommand', () => {
  const eventBus = new StubEventBus();
  const userRepository = new InMemoryUserRepository();
  const generatorService = new StubGeneratorService();
  const cryptoService = new StubCryptoService();
  const dateService = new StubDateService();

  const handler = new SignupCommandHandler(
    eventBus,
    userRepository,
    generatorService,
    cryptoService,
    dateService,
  );

  const create = factories();

  const userId = 'userId;';
  const nick = 'nick';
  const email = 'user@domain.tld';
  const password = 'p4ssw0rd';
  const now = create.timestamp('2022-01-01');
  const token = 'token;';

  const signup = async () => {
    return handler.handle(new SignupCommand(nick, email, password));
  };

  beforeEach(() => {
    generatorService.nextId = userId;
    generatorService.nextToken = token;
    dateService.setNow(now);
  });

  it('signs up as a new user', async () => {
    await signup();

    const createdUser = userRepository.get(userId);

    expect(createdUser).toBeDefined();
    expect(createdUser).toHaveProperty('email', email);
    expect(createdUser).toHaveProperty('nick', create.nick(nick));
    expect(createdUser).toHaveProperty('profileImage', create.profileImage());
    expect(createdUser).toHaveProperty('signupDate', now);
    expect(createdUser).toHaveProperty('lastLoginDate', null);
    expect(createdUser).toHaveProperty('emailValidationToken', token);
  });

  it("returns the created user's id", async () => {
    expect(await signup()).toEqual(userId);
  });

  it('emits a UserCreatedEvent', async () => {
    await signup();

    expect(eventBus.lastEvent).toEqual(new UserCreatedEvent(userId));
  });

  it('fails to signup when the email already exists', async () => {
    userRepository.add(create.user({ email }));

    await expect(signup()).rejects.toThrow(EmailAlreadyExistsError);
  });

  it('fails to signup when the nick already exists', async () => {
    userRepository.add(create.user({ nick: create.nick(nick) }));

    await expect(signup()).rejects.toThrow(NickAlreadyExistsError);
  });
});