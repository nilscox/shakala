import { TOKENS } from '@shakala/common';
import { injected } from 'brandi';
import * as request from 'supertest';

import { Server } from '../infrastructure/server';
import { jwt } from '../utils/jwt';

export class TestServer extends Server {
  get agent() {
    return request.agent(this.app);
  }

  as(userId: string): request.SuperAgentTest {
    const agent = this.agent;

    const token = jwt.encode({ uid: userId });
    void agent.set('Cookie', `token=${token}`);

    return agent;
  }
}

injected(TestServer, TOKENS.logger, TOKENS.config);
