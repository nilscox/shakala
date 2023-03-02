import util from 'node:util';

import { LoggerPort } from './logger.port';

export class ConsoleLoggerAdapter implements LoggerPort {
  private dateFormat = new Intl.DateTimeFormat('un-US', {
    hour12: false,
    second: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  private get date() {
    return this.dateFormat.format(Date.now());
  }

  private formatArg(this: void, arg: unknown) {
    if (typeof arg === 'string') {
      return arg;
    }

    return util.inspect(arg, { colors: true });
  }

  private log(level: string, ...args: unknown[]) {
    const line: string[] = [];

    line.push(`[${this.date}]`);
    line.push(`[${level}]`);

    if (this.tag) {
      line.push(`[${this.tag}]`);
    }

    line.push(...args.map(this.formatArg));

    if (level === 'error') {
      console.error(line.join(' '));
    } else {
      console.log(line.join(' '));
    }
  }

  tag?: string;

  verbose(...args: unknown[]): void {
    this.log('verbose', ...args);
  }

  info(...args: unknown[]): void {
    this.log('info', ...args);
  }

  warning(...args: unknown[]): void {
    this.log('warning', ...args);
  }

  error(...args: unknown[]): void {
    this.log('error', ...args);
  }
}
