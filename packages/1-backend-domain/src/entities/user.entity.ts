import { UnexpectedError } from 'shared';

import { AggregateRoot } from '../ddd/aggregate-root';
import { EntityProps } from '../ddd/entity';
import { UserCreatedEvent } from '../events/user-created.event';
import { CryptoService } from '../interfaces/crypto.interface';
import { DateService } from '../interfaces/date.interface';
import { GeneratorService } from '../interfaces/generator-service.interface';
import { ProfileImageStoreService } from '../interfaces/profile-image-store-service.interface';

import { DomainError } from './domain-error';
import { Nick } from './nick.value-object';
import { ProfileImage, ProfileImageData } from './profile-image.value-object';
import { Timestamp } from './timestamp.value-object';

export type UserProps = EntityProps<{
  email: string;
  hashedPassword: string;
  nick: Nick;
  profileImage: ProfileImage | null;
  signupDate: Timestamp;
  lastLoginDate: Timestamp | null;
  emailValidationToken: string | null;
  hasWriteAccess: boolean;
}>;

type CreateUserProps = {
  nick: string;
  email: string;
  password: string;
};

export class User extends AggregateRoot<UserProps> {
  constructor(
    props: UserProps,
    private readonly generatorService: GeneratorService,
    private readonly dateService: DateService,
    private readonly cryptoService: CryptoService,
    private readonly profileImageStoreService: ProfileImageStoreService,
  ) {
    super(props);
  }

  static async create(
    { nick, email, password }: CreateUserProps,
    generatorService: GeneratorService,
    dateService: DateService,
    cryptoService: CryptoService,
    profileImageStoreService: ProfileImageStoreService,
  ) {
    const user = new User(
      {
        id: await generatorService.generateId(),
        nick: new Nick(nick),
        email,
        hashedPassword: await cryptoService.hash(password),
        profileImage: null,
        signupDate: new Timestamp(dateService.nowAsString()),
        lastLoginDate: null,
        emailValidationToken: await generatorService.generateToken(),
        hasWriteAccess: true,
      },
      generatorService,
      dateService,
      cryptoService,
      profileImageStoreService,
    );

    user.addEvent(new UserCreatedEvent(user.id));

    return user;
  }

  get email() {
    return this.props.email;
  }

  get hashedPassword() {
    return this.props.hashedPassword;
  }

  get nick() {
    return this.props.nick;
  }

  get profileImage() {
    return this.props.profileImage;
  }

  get signupDate() {
    return this.props.signupDate;
  }

  get lastLoginDate() {
    return this.props.lastLoginDate;
  }

  get emailValidationToken() {
    return this.props.emailValidationToken;
  }

  get isEmailValidated() {
    return this.emailValidationToken === null;
  }

  get hasWriteAccess() {
    return this.props.hasWriteAccess;
  }

  async authenticate(password: string): Promise<void> {
    const matchPassword = await this.cryptoService.compare(password, this.props.hashedPassword);

    if (!matchPassword) {
      throw new InvalidCredentials();
    }

    this.props.lastLoginDate = new Timestamp(this.dateService.now());
  }

  validateEmailAddress(token: string) {
    if (this.isEmailValidated) {
      throw new EmailValidationFailed(EmailValidationFailedReason.alreadyValidated);
    }

    if (this.emailValidationToken !== token) {
      throw new EmailValidationFailed(EmailValidationFailedReason.invalidToken);
    }

    this.props.emailValidationToken = null;
  }

  async getProfileImageData(): Promise<ProfileImageData | null> {
    if (!this.profileImage) {
      return null;
    }

    const data = await this.profileImageStoreService.readProfileImage(this.profileImage);

    if (!data) {
      throw new UnexpectedError('User: expected profile image data to exist', {
        userId: this.id,
        profileImage: this.profileImage,
      });
    }

    return data;
  }

  async setProfileImage(data: ProfileImageData | null): Promise<void> {
    if (data) {
      const imageId = await this.generatorService.generateId();
      const profileImage = new ProfileImage([imageId, data.type].join('.'));

      await this.profileImageStoreService.writeProfileImage(this.id, profileImage, data);
      this.props.profileImage = profileImage;
    } else {
      this.props.profileImage = null;
    }
  }
}

export const InvalidCredentials = DomainError.extend('invalid credentials');

export enum EmailValidationFailedReason {
  alreadyValidated = 'EmailAlreadyValidated',
  invalidToken = 'InvalidToken',
}

export const EmailValidationFailed = DomainError.extend(
  'email validation failed',
  (reason: EmailValidationFailedReason) => ({ reason }),
);
