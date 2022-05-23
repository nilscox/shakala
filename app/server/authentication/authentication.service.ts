import { inject, injectable } from 'inversify';

import { UserRepository, UserRepositoryToken } from '~/server/data/user/user.repository';

import { CryptoService, CryptoServiceToken } from '../common/crypto.service';
import { GeneratorServiceToken, GeneratorService } from '../common/generator.service';
import { UserEntity } from '../data/user/user.entity';

export class DomainError extends Error {
  constructor(message: string, public readonly details?: Record<string, unknown>) {
    super(message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('InvalidCredentials');
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('EmailAlreadyExists', { email });
  }
}

@injectable()
export class AuthenticationService {
  constructor(
    @inject(CryptoServiceToken)
    private readonly cryptoService: CryptoService,
    @inject(GeneratorServiceToken)
    private readonly generatorService: GeneratorService,
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async login(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!(await this.cryptoService.compare(password, user.hashedPassword))) {
      throw new InvalidCredentialsError();
    }

    return user;
  }

  async signup(email: string, password: string, nick: string): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(email);
    }

    const hashedPassword = await this.cryptoService.hash(password);

    const user = new UserEntity({
      id: await this.generatorService.generateId(),
      email,
      hashedPassword,
      nick,
      profileImage: null,
      signupDate: new Date().toISOString(),
      lastLoginDate: null,
    });

    await this.userRepository.save(user);

    return user;
  }
}
