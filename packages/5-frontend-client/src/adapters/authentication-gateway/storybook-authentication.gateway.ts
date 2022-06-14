import { AuthenticationGateway, createAuthUser } from 'frontend-domain';
import { AuthUserDto } from 'shared';

import { gatewayAction } from '~/utils/gateway-action';

export class StorybookAuthenticationGateway implements AuthenticationGateway {
  private action<T>(method: string, args: unknown[], result: T) {
    return gatewayAction(this, method, args, result);
  }

  fetchUser(): Promise<AuthUserDto | undefined> {
    return this.action('fetchUser', [], undefined);
  }

  login(email: string, password: string): Promise<AuthUserDto> {
    return this.action('login', [email, password], createAuthUser({ email }));
  }

  signup(email: string, password: string, nick: string): Promise<AuthUserDto> {
    return this.action(
      'signup',
      [email, password, nick],
      createAuthUser({ email, nick, signupDate: new Date().toISOString() }),
    );
  }

  logout(): Promise<void> {
    return this.action('logout', [], undefined);
  }
}
