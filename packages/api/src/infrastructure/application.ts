import { EmailModule } from '@shakala/email';
import { ThreadModule } from '@shakala/thread';
import { UserModule } from '@shakala/user';

import { container } from '../container';

export interface Application {
  init(): Promise<void>;
  close(): Promise<void>;
}

export class ProductionApplication implements Application {
  private emailModule = new EmailModule(container);
  private userModule = new UserModule(container);
  private threadModule = new ThreadModule(container);

  async init() {
    await this.emailModule.init();
    await this.userModule.init();
    await this.threadModule.init();
  }

  async close() {}
}
