import { createUser } from 'backend-application';
import { Comment, Thread } from 'backend-domain';
import { agent } from 'supertest';

import { Server } from '../server';

export class TestServer extends Server {
  agent() {
    return agent(this.app);
  }

  async saveUser(email: string, password: string) {
    await this.userRepository.save(
      createUser({
        email,
        hashedPassword: await this.cryptoService.hash(password),
      }),
    );
  }

  async saveThread(thread: Thread) {
    await this.threadRepository.save(thread);
  }

  async saveComment(comment: Comment) {
    await this.commentRepository.save(comment);
  }
}
