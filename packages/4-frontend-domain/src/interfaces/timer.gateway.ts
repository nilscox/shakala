type ClearTimer = () => void;

export interface TimerGateway {
  setTimeout(cb: () => void, ms: number): ClearTimer;
  setInterval(cb: () => void, ms: number): ClearTimer;
}
