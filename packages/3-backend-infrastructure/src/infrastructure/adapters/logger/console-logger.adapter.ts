import { LoggerPort } from '@shakala/backend-application';
import { DatePort } from '@shakala/backend-domain';

export class ConsoleLoggerAdapter implements LoggerPort {
  constructor(private readonly dateAdapter: DatePort, private readonly console = globalThis.console) {}

  log = this._log('log');
  info = this._log('info');
  error = this._log('error');

  private _log(level: keyof LoggerPort) {
    return (...args: unknown[]) => {
      const date = this.formattedDate();

      this.console[level](`[${date}] [${level}]`, ...args.map(this.formatArgument));
    };
  }

  private formattedDate() {
    const now = this.dateAdapter.now();

    return [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].map(pad).join('-'),
      [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(':'),
    ].join(' ');
  }

  private formatArgument(arg: unknown) {
    if (arg instanceof Error) {
      return arg.stack;
    }

    return arg;
  }
}

const pad = (param: string | number) => {
  return String(param).padStart(2, '0');
};
