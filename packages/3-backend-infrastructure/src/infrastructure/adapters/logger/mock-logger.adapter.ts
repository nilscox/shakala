import { LoggerPort } from 'backend-application';
import { mockFn } from 'shared';

export class MockLoggerAdapter implements LoggerPort {
  log = mockFn<LoggerPort['log']>();
  info = mockFn<LoggerPort['info']>();
  error = mockFn<LoggerPort['error']>();
}
