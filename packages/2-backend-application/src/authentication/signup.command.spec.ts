import {
  factories,
  StubCryptoService,
  StubDateService,
  StubGeneratorService,
  UserCreatedEvent,
} from 'backend-domain';

import { InMemoryUserRepository } from '../user/user.in-memory-repository';
import { StubEventBus } from '../utils/stub-event-bus';

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

  const nick = 'nick';
  const email = 'user@domain.tld';
  const password = 'p4ssw0rd';
  const now = create.timestamp('2022-01-01');

  const signup = async () => {
    return handler.handle(new SignupCommand(nick, email, password));
  };

  beforeEach(() => {
    generatorService.nextId = 'userId';
    dateService.setNow(now);
  });

  it('signs up as a new user', async () => {
    await signup();

    const createdUser = userRepository.get('userId');

    expect(createdUser).toBeDefined();
    expect(createdUser?.email).toEqual(email);
    expect(createdUser?.nick.equals(create.nick(nick))).toBe(true);
    expect(createdUser?.profileImage.equals(create.profileImage())).toBe(true);
    expect(createdUser?.signupDate.equals(now)).toBe(true);
    expect(createdUser?.lastLoginDate).toBeNull();
  });

  it("returns the created user's id", async () => {
    expect(await signup()).toEqual('userId');
  });

  it('emits a UserCreatedEvent', async () => {
    await signup();

    expect(eventBus.lastEvent).toEqual(new UserCreatedEvent('userId'));
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
