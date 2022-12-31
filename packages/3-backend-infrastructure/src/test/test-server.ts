import { MikroORM } from '@mikro-orm/core';
import {
  CreateCommentCommand,
  CreateThreadCommand,
  ExecutionContext,
  GetUserByIdQuery,
  SignupCommand,
  ValidateEmailAddressCommand,
} from '@shakala/backend-application';
import { User } from '@shakala/backend-domain';
import { LoginBodyDto } from '@shakala/shared';
import { agent, SuperAgentTest } from 'supertest';

import { resetDatabase } from '../persistence/mikro-orm/create-database-connection';
import { Server } from '../server';

export class TestServer extends Server {
  async reset() {
    await resetDatabase(this.orm as MikroORM);
  }

  agent() {
    return agent(this.app);
  }

  async createUserAndLogin(agent: SuperAgentTest, loginDto: LoginBodyDto) {
    const { email, password } = loginDto;

    const userId = await this.commandBus.execute<string>(
      new SignupCommand(email, email, password),
      ExecutionContext.unauthenticated,
    );

    const user = await this.queryBus.execute<User>(new GetUserByIdQuery(userId));

    await this.commandBus.execute(
      new ValidateEmailAddressCommand(user.id, user.emailValidationToken as string),
      ExecutionContext.unauthenticated,
    );

    await agent.post('/auth/login').send(loginDto).expect(200);

    return userId;
  }

  async createThread(authorId: string) {
    const user = await this.queryBus.execute<User>(new GetUserByIdQuery(authorId));

    return this.commandBus.execute<string>(
      new CreateThreadCommand('description', 'text', []),
      new ExecutionContext(user),
    );
  }

  async createComment(threadId: string, authorId: string) {
    const user = await this.queryBus.execute<User>(new GetUserByIdQuery(authorId));

    return this.commandBus.execute<string>(
      new CreateCommentCommand(threadId, null, 'text'),
      new ExecutionContext(user),
    );
  }
}
