import {
  AuthenticationMethod,
  EmailValidationFailed,
  EmailValidationFailedReason,
  InvalidCredentials,
  UnexpectedError,
} from '@shakala/shared';

import { AggregateRoot } from '../ddd/aggregate-root';
import { EntityProps } from '../ddd/entity';
import { UserAuthenticatedEvent } from '../events/authentication/user-authenticated.event';
import { UserAuthenticationFailedEvent } from '../events/authentication/user-authentication-failed.event';
import { UserCreatedEvent } from '../events/authentication/user-created.event';
import { UserSignedOutEvent } from '../events/authentication/user-signed-out.event';
import { EmailAddressValidatedEvent } from '../events/profile/email-address-validated.event';
import { ProfileImageChangedEvent } from '../events/profile/profile-image-changed.event';
import { CryptoPort } from '../interfaces/crypto.interface';
import { DatePort } from '../interfaces/date.interface';
import { GeneratorPort } from '../interfaces/generator.port';
import { ProfileImageStorePort } from '../interfaces/profile-image-store.port';

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
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
    private readonly crypto: CryptoPort,
    private readonly profileImageStore: ProfileImageStorePort,
  ) {
    super(props);
  }

  static async create(
    { nick, email, password }: CreateUserProps,
    generator: GeneratorPort,
    date: DatePort,
    crypto: CryptoPort,
    profileImageStore: ProfileImageStorePort,
  ) {
    const user = new User(
      {
        id: await generator.generateId(),
        nick: new Nick(nick),
        email,
        hashedPassword: await crypto.hash(password),
        profileImage: null,
        signupDate: new Timestamp(date.nowAsString()),
        lastLoginDate: null,
        emailValidationToken: await generator.generateToken(),
        hasWriteAccess: true,
      },
      generator,
      date,
      crypto,
      profileImageStore,
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
    const matchPassword = await this.crypto.compare(password, this.props.hashedPassword);

    if (!matchPassword) {
      this.addEvent(new UserAuthenticationFailedEvent(this.id, AuthenticationMethod.emailPassword));
      throw new InvalidCredentials();
    }

    this.props.lastLoginDate = new Timestamp(this.date.now());

    this.addEvent(new UserAuthenticatedEvent(this.id, AuthenticationMethod.emailPassword));
  }

  signOut() {
    this.addEvent(new UserSignedOutEvent(this.id));
  }

  validateEmailAddress(token: string) {
    if (this.isEmailValidated) {
      throw new EmailValidationFailed(EmailValidationFailedReason.alreadyValidated);
    }

    if (this.emailValidationToken !== token) {
      throw new EmailValidationFailed(EmailValidationFailedReason.invalidToken);
    }

    this.props.emailValidationToken = null;

    this.addEvent(new EmailAddressValidatedEvent(this.id));
  }

  async getProfileImageData(): Promise<ProfileImageData | null> {
    if (!this.profileImage) {
      return null;
    }

    const data = await this.profileImageStore.readProfileImage(this.profileImage);

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
      const imageId = await this.generator.generateId();
      const profileImage = new ProfileImage([imageId, data.type].join('.'));

      await this.profileImageStore.writeProfileImage(this.id, profileImage, data);
      this.props.profileImage = profileImage;

      this.addEvent(new ProfileImageChangedEvent(this.id, profileImage.toString()));
    } else {
      this.props.profileImage = null;
      this.addEvent(new ProfileImageChangedEvent(this.id, null));
    }
  }
}
