import { Nick, ProfileImage, Timestamp } from 'backend-domain';

import { StubCryptoService } from '../test/crypto.stub';
import { StubDateService } from '../test/date.stub';
import { StubGeneratorService } from '../test/generator.stub';
import { createUser } from '../utils/factories';
import { InMemoryUserRepository } from '../utils/user.in-memory-repository';

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

  const nick = 'nick';
  const email = 'user@domain.tld';
  const password = 'p4ssw0rd';
  const now = new Date('2022-01-01');

  const signup = async () => {
    await handler.handle(new SignupCommand(nick, email, password));
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
    expect(createdUser?.nick.equals(new Nick(nick))).toBe(true);
    expect(createdUser?.profileImage.equals(new ProfileImage())).toBe(true);
    expect(createdUser?.signupDate.equals(new Timestamp(now))).toBe(true);
    expect(createdUser?.lastLoginDate).toBeNull();
  });

  it('fails to signup when the email already exists', async () => {
    userRepository.add(createUser({ email }));

    await expect(signup()).rejects.toThrow(EmailAlreadyExistsError);
  });

  it('fails to signup when the nick already exists', async () => {
    userRepository.add(createUser({ nick }));

    await expect(signup()).rejects.toThrow(NickAlreadyExistsError);
  });
});
