import { User } from 'backend-domain';
import { agent } from 'supertest';

import { Server } from '../server';

export class TestServer extends Server {
  agent() {
    return agent(this.app);
  }

  async saveUser(user: User) {
    await this.userRepository.save(user);
  }
}
