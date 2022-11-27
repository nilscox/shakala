import { SnackbarGateway } from '../gateways/snackbar.gateway';

export class StubSnackbarGateway implements SnackbarGateway {
  successMessages = new Array<string>();

  success(message: string): void {
    this.successMessages.push(message);
  }

  warningMessages = new Array<string>();

  warning(message: string): void {
    this.warningMessages.push(message);
  }

  errorMessages = new Array<string>();

  error(message: string): void {
    this.errorMessages.push(message);
  }
}
