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
