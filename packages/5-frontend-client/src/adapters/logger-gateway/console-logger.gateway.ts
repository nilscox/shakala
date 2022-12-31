import { LoggerGateway } from '@shakala/frontend-domain';

export class ConsoleLoggerGateway implements LoggerGateway {
  warn = console.warn;
  error = console.error;
}
