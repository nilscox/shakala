import { TOKENS } from '@shakala/common';
import { TestEmailModule } from '@shakala/email';
import { TestThreadModule } from '@shakala/thread';
import { UserModule } from '@shakala/user';
import { injected } from 'brandi';

import { container } from '../container';
import { Application } from '../infrastructure/application';
import { Server } from '../infrastructure/server';
import { jwt } from '../utils/jwt';

import { FetchAgent } from './fetch-agent';

export class TestApplication implements Application {
  private emailModule = new TestEmailModule(container);
  private userModule = new UserModule(container);
  private threadModule = new TestThreadModule(container);

  async init() {
    await this.emailModule.init();
    await this.userModule.init();
    await this.threadModule.init();
  }

  async close() {}
}

export class TestServer extends Server {
  application = new TestApplication();

  agent() {
    return new FetchAgent(this.app);
  }

  as(userId: string): FetchAgent {
    const agent = this.agent();

    const token = jwt.encode({ uid: userId });
    agent.setHeader('Cookie', `token=${token}`);

    return agent;
  }
}

injected(TestServer, TOKENS.logger, TOKENS.config);
