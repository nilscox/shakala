import { TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { Server } from '../infrastructure/server';
import { jwt } from '../utils/jwt';

import { FetchAgent } from './fetch-agent';
import { ServerObserver } from './server-observer';

export class TestServer extends Server {
  private serverObserver?: ServerObserver;
  private agents = new Set<FetchAgent>();

  override async listen() {
    await super.listen();

    if (this.server) {
      this.serverObserver = new ServerObserver(this.server);
    }
  }

  override async close() {
    for (const agent of this.agents) {
      await agent.closeServer();
    }

    this.serverObserver?.closeAllConnections();

    await super.close();
  }

  agent() {
    const agent = new FetchAgent(this.app);

    this.agents.add(agent);

    return agent;
  }

  as(userId: string): FetchAgent {
    const agent = this.agent();

    const token = jwt.encode({ uid: userId });
    agent.setHeader('Cookie', `token=${token}`);

    return agent;
  }
}

injected(TestServer, TOKENS.logger, TOKENS.config);
