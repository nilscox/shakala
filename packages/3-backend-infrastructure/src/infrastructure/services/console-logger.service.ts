import { LoggerService } from 'backend-application';

export class ConsoleLoggerService implements LoggerService {
  log = this._log('log');
  info = this._log('info');
  error = this._log('error');

  private _log(level: keyof LoggerService) {
    return (...args: unknown[]) => {
      const date = this.formattedDate();

      console.log(`[${date}] [${level}]`, ...args);
    };
  }

  private formattedDate() {
    const now = new Date();

    return [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].map(pad).join('-'),
      [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join('-'),
    ].join(' ');
  }
}

const pad = (param: string | number) => {
  return String(param).padStart(2, '0');
};
