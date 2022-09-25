import { AuthenticationType } from '../authentication';

export const LocationChange = Symbol('LocationChange');
export type RemoveListener = () => void;

export interface RouterGateway {
  navigate(to: string): void;
  getQueryParam(key: string): undefined | string;
  setQueryParam(key: string, value: string): void;
  removeQueryParam(key: string): void;
  onLocationChange(listener: () => void): RemoveListener;

  currentAuthenticationForm: AuthenticationType | undefined;
}
