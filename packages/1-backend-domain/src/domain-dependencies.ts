import { CryptoPort } from './interfaces/crypto.interface';
import { DatePort } from './interfaces/date.interface';
import { GeneratorPort } from './interfaces/generator.port';
import { ProfileImageStorePort } from './interfaces/profile-image-store.port';

export type DomainDependencies = {
  generator: GeneratorPort;
  date: DatePort;
  crypto: CryptoPort;
  profileImageStore: ProfileImageStorePort;
};
