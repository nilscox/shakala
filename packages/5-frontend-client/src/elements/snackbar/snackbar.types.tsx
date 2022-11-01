export enum SnackType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

export type Snack = {
  id: string;
  type: SnackType;
  transition: 'in' | 'out' | undefined;
  message: string;
};
