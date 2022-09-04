import { MikroORM } from '@mikro-orm/core';
import { CreateCommentCommand, CreateThreadCommand, SignupCommand } from 'backend-application';
import { LoginBodyDto } from 'shared';
import { agent, SuperAgentTest } from 'supertest';

import { createTestDatabaseConnection, resetDatabase } from '../persistence/mikro-orm/create-database-connection';
import { Server } from '../server';

export class TestServer extends Server {
  protected override createDatabaseConnection = createTestDatabaseConnection;

  async reset() {
    await resetDatabase(this.orm as MikroORM);
  }

  agent() {
    return agent(this.app);
  }

  async createUserAndLogin(agent: SuperAgentTest, loginDto: LoginBodyDto) {
    const { email, password } = loginDto;

    const userId = await this.commandBus.execute<string>(new SignupCommand(email, email, password));

    await agent.post('/auth/login').send(loginDto).expect(200);

    return userId;
  }

  async createThread(authorId: string) {
    return this.commandBus.execute<string>(new CreateThreadCommand(authorId, 'description', 'text', []));
  }

  async createComment(threadId: string, authorId: string) {
    return this.commandBus.execute<string>(
      new CreateCommentCommand(threadId, authorId, null, 'text'),
    );
  }
}
