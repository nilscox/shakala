import { LoggerGateway } from 'frontend-domain';

export class ConsoleLoggerGateway implements LoggerGateway {
  warn = console.warn;
}
