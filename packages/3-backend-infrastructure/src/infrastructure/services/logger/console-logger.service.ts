import { LoggerService } from 'backend-application';
import { DateService } from 'backend-domain';

export class ConsoleLoggerService implements LoggerService {
  constructor(private readonly dateService: DateService, private readonly console = globalThis.console) {}

  log = this._log('log');
  info = this._log('info');
  error = this._log('error');

  private _log(level: keyof LoggerService) {
    return (...args: unknown[]) => {
      const date = this.formattedDate();

      this.console[level](`[${date}] [${level}]`, ...args.map(this.formatArgument));
    };
  }

  private formattedDate() {
    const now = this.dateService.now();

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
