import { ValueObject } from '../ddd/value-object';

type ProfileImageProps = string | null;

export class ProfileImage extends ValueObject<ProfileImageProps> {
  constructor(value: ProfileImageProps = null) {
    super(value)
  }

  override toString() {
    return this.value;
  }
}
