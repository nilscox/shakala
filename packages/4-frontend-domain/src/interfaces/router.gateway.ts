export const LocationChange = Symbol('LocationChange');
export type RemoveListener = () => void;

export interface RouterGateway {
  navigate(to: string): void;
  getQueryParam(key: string): undefined | string;
  removeQueryParam(key: string): void;
  onLocationChange(listener: () => void): RemoveListener;
}
