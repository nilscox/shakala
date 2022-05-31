import { inject, injectable } from 'inversify';

import { UserRepository, UserRepositoryToken } from '~/server/data/user/user.repository';

import { CryptoService, CryptoServiceToken } from '../common/crypto.service';
import { DateServiceToken, DateService } from '../common/date.service';
import { DomainError } from '../common/domain-error';
import { GeneratorServiceToken, GeneratorService } from '../common/generator.service';
import { Nick } from '../common/nick.value-object';
import { ProfileImage } from '../common/profile-image.value-object';
import { Timestamp } from '../common/timestamp.value-object';
import { User } from '../user/user.entity';

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
    @inject(DateServiceToken)
    private readonly dateService: DateService,
    @inject(CryptoServiceToken)
    private readonly cryptoService: CryptoService,
    @inject(GeneratorServiceToken)
    private readonly generatorService: GeneratorService,
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!(await user.checkPassword(this.cryptoService, password))) {
      throw new InvalidCredentialsError();
    }

    return user;
  }

  async signup(email: string, password: string, nick: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(email);
    }

    const hashedPassword = await this.cryptoService.hash(password);

    const user = User.create({
      id: await this.generatorService.generateId(),
      email,
      hashedPassword,
      nick: Nick.create(nick),
      profileImage: ProfileImage.create(),
      signupDate: Timestamp.now(this.dateService),
      lastLoginDate: null,
    });

    await this.userRepository.save(user);

    return user;
  }
}
