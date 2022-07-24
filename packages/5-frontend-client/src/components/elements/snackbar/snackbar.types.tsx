export enum SnackType {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export type Snack = {
  id: string;
  type: SnackType;
  transition: 'in' | 'out' | undefined;
  message: string;
};
