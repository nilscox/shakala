import { TOKENS } from '@shakala/common';
import { PERSISTENCE_TOKENS } from '@shakala/persistence';
import { injected } from 'brandi';

import { Server } from '../infrastructure/server';
import { jwt } from '../utils/jwt';

import { FetchAgent } from './fetch-agent';

export class TestServer extends Server {
  private agents = new Set<FetchAgent>();

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

  override async close() {
    for (const agent of this.agents) {
      await agent.closeServer();
    }

    await super.close();
  }
}

injected(TestServer, TOKENS.logger, TOKENS.config, PERSISTENCE_TOKENS.ormContext);
