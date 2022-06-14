export interface SnackbarGateway {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
}
