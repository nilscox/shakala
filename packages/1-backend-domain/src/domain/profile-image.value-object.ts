import { ValueObject } from '../ddd/value-object';

type ProfileImageProps = string | null;

export class ProfileImage extends ValueObject<ProfileImageProps> {
  constructor(value?: string) {
    super(value ?? null)
  }

  override toString() {
    return this.value;
  }
}
