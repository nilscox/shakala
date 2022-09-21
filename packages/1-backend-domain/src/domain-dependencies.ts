import { CryptoService } from './interfaces/crypto.interface';
import { DateService } from './interfaces/date.interface';
import { GeneratorService } from './interfaces/generator-service.interface';
import { ProfileImageStoreService } from './interfaces/profile-image-store-service.interface';

export type DomainDependencies = {
  generatorService: GeneratorService;
  dateService: DateService;
  cryptoService: CryptoService;
  profileImageStoreService: ProfileImageStoreService;
};
