import {
  CreateCommentCommand,
  CreateThreadCommand, SignupCommand
} from 'backend-application';
import { agent } from 'supertest';

import { createTestDatabaseConnection } from '../persistence/mikro-orm/create-database-connection';
import { Server } from '../server';

export class TestServer extends Server {
  protected override createDatabaseConnection = createTestDatabaseConnection;

  async reset() {
    await this.orm.getSchemaGenerator().refreshDatabase();
  }

  agent() {
    return agent(this.app);
  }

  async createUser(email: string, password: string) {
    return this.commandBus.execute<string>(new SignupCommand('nick', email, password));
  }

  async createThread(authorId: string) {
    return this.commandBus.execute<string>(new CreateThreadCommand(authorId, 'text'));
  }

  async createComment(threadId: string, authorId: string) {
    return this.commandBus.execute<string>(
      new CreateCommentCommand(threadId, authorId, null, 'text'),
    );
  }
}
