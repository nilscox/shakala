import { ThreadGateway } from 'frontend-domain';
import { ThreadDto } from 'shared';

import { gatewayAction } from '~/utils/gateway-action';

export class StorybookThreadGateway implements ThreadGateway {
  private action<T>(method: string, args: unknown[], result: T) {
    return gatewayAction(this, method, args, result);
  }

  getLast(count: number): Promise<ThreadDto[]> {
    return this.action('getLast', [count], []);
  }
}
