type ClearInterval = () => void;

export interface TimerGateway {
  setInterval(cb: () => void, interval: number): ClearInterval;
}
