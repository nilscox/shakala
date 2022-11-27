import { TimerGateway } from '../gateways';

export class StubTimerGateway implements TimerGateway {
  interval?: () => void;

  setInterval(cb: () => void) {
    this.interval = cb;

    return () => {
      delete this.interval;
    };
  }

  hasInterval() {
    return this.interval !== undefined;
  }

  invokeInterval() {
    return this.interval?.();
  }
}
