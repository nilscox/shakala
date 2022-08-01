export interface LoggerGateway {
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}
