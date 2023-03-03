import { TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { Server } from '../infrastructure/server';
import { jwt } from '../utils/jwt';

import { FetchAgent } from './fetch-agent';

export class TestServer extends Server {
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
