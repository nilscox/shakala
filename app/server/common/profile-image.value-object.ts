import { ValueObject } from '../ddd/value-object';

type ProfileImageProps = string | null;

export class ProfileImage extends ValueObject<ProfileImageProps> {
  get value() {
    return this.val;
  }

  static create(value?: ProfileImageProps) {
    return new ProfileImage(value ?? null);
  }
}
