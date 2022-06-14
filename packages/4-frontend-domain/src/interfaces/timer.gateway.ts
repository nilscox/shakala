type ClearTimeout = () => void;

export interface TimerGateway {
  setTimeout(cb: () => void, ms: number): ClearTimeout;
}
