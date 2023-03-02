import { EmailModule } from '@shakala/email';
import { UserModule } from '@shakala/user';

import { container } from '../container';

export class Application {
  private emailModule = new EmailModule(container);
  private userModule = new UserModule(container);

  async init() {
    await this.emailModule.init();
    await this.userModule.init();
  }

  async close() {}
}
