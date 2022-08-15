import { LoggerService } from 'backend-application';

export class MockLoggerService implements LoggerService {
  log: LoggerService['log'] = vi.fn();
  info: LoggerService['info'] = vi.fn();
  error: LoggerService['log'] = vi.fn();
}
