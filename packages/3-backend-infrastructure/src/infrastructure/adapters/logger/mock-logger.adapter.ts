import { LoggerPort } from '@shakala/backend-application';
import { mockFn } from '@shakala/shared/test';

export class MockLoggerAdapter implements LoggerPort {
  log = mockFn<LoggerPort['log']>();
  info = mockFn<LoggerPort['info']>();
  error = mockFn<LoggerPort['error']>();
}
