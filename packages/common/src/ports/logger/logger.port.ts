export interface LoggerPort {
  tag?: string;

  verbose(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warning(...args: unknown[]): void;
  error(...args: unknown[]): void;
}
