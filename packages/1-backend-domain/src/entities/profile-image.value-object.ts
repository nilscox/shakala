import { ValueObject } from '../ddd/value-object';

export class ProfileImage extends ValueObject<string> {
  override toString() {
    return this.value;
  }
}

export enum ProfileImageType {
  png = 'png',
  jpg = 'jpg',
  bmp = 'bmp',
}

type ProfileImageDataProps = {
  type: ProfileImageType;
  data: Buffer;
}

export class ProfileImageData extends ValueObject<ProfileImageDataProps> {
  get type() {
    return this.value.type;
  }

  get data() {
    return this.value.data;
  }
}
