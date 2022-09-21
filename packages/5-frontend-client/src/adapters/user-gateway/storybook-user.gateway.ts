import { UserGateway } from 'frontend-domain/src/user/user.gateway';

import { gatewayAction } from '~/utils/gateway-action';

export class StorybookUserGateway implements UserGateway {
  private action<T>(method: string, args: unknown[], result: T) {
    return gatewayAction(this, method, args, result);
  }

  changeProfileImage(_image: File): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
