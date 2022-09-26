import { LoggerPort } from 'backend-application';

export class MockLoggerAdapter implements LoggerPort {
  log: LoggerPort['log'] = vi.fn();
  info: LoggerPort['info'] = vi.fn();
  error: LoggerPort['log'] = vi.fn();
}
