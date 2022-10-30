import { SnackbarGateway } from 'frontend-domain';

export class ConsoleLogSnackbarGateway implements SnackbarGateway {
  success = console.log;
  error = console.log;
  warning = console.log;
}
