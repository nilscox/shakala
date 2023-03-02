import { LoggerPort } from './logger.port';

export class StubLoggerAdapter extends Array<[string, unknown[]]> implements LoggerPort {
  verbose(...args: unknown[]): void {
    this.push(['verbose', args]);
  }

  info(...args: unknown[]): void {
    this.push(['info', args]);
  }

  warning(...args: unknown[]): void {
    this.push(['warning', args]);
  }

  error(...args: unknown[]): void {
    this.push(['error', args]);
  }
}
