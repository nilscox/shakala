import { TimerGateway } from 'frontend-domain';

export class RealTimerGateway implements TimerGateway {
  setTimeout(cb: () => void, ms: number): () => void {
    const timeout = window.setTimeout(cb, ms);

    return () => {
      clearTimeout(timeout);
    };
  }
}
