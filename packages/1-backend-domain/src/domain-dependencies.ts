import { CryptoService } from './interfaces/crypto.interface';
import { DateService } from './interfaces/date.interface';
import { GeneratorService } from './interfaces/generator-service.interface';

export type DomainDependencies = {
  generatorService: GeneratorService;
  dateService: DateService;
  cryptoService: CryptoService;
};
