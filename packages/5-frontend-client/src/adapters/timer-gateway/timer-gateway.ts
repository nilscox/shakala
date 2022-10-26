import { TimerGateway } from 'frontend-domain';

export class RealTimerGateway implements TimerGateway {
  setTimeout = this.timerMethod(window.setTimeout);
  setInterval = this.timerMethod(window.setInterval);

  private timerMethod(method: Window['setTimeout'] | Window['setInterval']) {
    return (cb: () => void, ms: number) => {
      const interval = method(cb, ms);
      return () => clearInterval(interval);
    };
  }
}
