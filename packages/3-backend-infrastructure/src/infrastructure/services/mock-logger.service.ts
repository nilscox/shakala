import { LoggerService } from './logger.service';

export class MockLoggerService implements LoggerService {
  log: LoggerService['log'] = vi.fn();
  info: LoggerService['info'] = vi.fn();
  error: LoggerService['log'] = vi.fn();
}
