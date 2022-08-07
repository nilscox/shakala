import { factories, StubGeneratorService } from 'backend-domain';

import { StubCryptoService } from '../test/crypto.stub';
import { StubDateService } from '../test/date.stub';
import { InMemoryUserRepository } from '../user/user.in-memory-repository';

import {
  EmailAlreadyExistsError,
  NickAlreadyExistsError,
  SignupCommand,
  SignupCommandHandler,
} from './signup.command';

describe('SignupCommand', () => {
  const userRepository = new InMemoryUserRepository();
  const generatorService = new StubGeneratorService();
  const cryptoService = new StubCryptoService();
  const dateService = new StubDateService();

  const handler = new SignupCommandHandler(userRepository, generatorService, cryptoService, dateService);

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

  it('fails to signup when the email already exists', async () => {
    userRepository.add(create.user({ email }));

    await expect(signup()).rejects.toThrow(EmailAlreadyExistsError);
  });

  it('fails to signup when the nick already exists', async () => {
    userRepository.add(create.user({ nick: create.nick(nick) }));

    await expect(signup()).rejects.toThrow(NickAlreadyExistsError);
  });
});
