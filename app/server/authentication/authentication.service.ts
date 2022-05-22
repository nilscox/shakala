import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';

import { UserRepository, UserRepositoryToken } from '~/server/repositories/user.repository';
import { User } from '~/types';

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
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!(await bcrypt.compare(password, user.hashedPassword))) {
      throw new InvalidCredentialsError();
    }

    return user;
  }

  async signup(email: string, password: string, nick: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(email);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      id: Math.random().toString(36).slice(-6),
      email,
      hashedPassword,
      nick,
    };

    await this.userRepository.save(user);

    return user;
  }
}
