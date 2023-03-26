import { EntityNotFoundError, Timestamp } from '@shakala/common';
import { PERSISTENCE_TOKENS, SqlRepository, SqlUser } from '@shakala/persistence';
import { injected } from 'brandi';

import { Nick } from '../../entities/nick.value-object';
import { User } from '../../entities/user.entity';
import { GetUserResult } from '../../queries/get-user';

import { UserRepository } from './user.repository';

export class SqlUserRepository extends SqlRepository<User, SqlUser> implements UserRepository {
  protected SqlEntity = SqlUser;

  protected toEntity(sqlUser: SqlUser): User {
    return new User({
      id: sqlUser.id,
      nick: new Nick(sqlUser.nick),
      email: sqlUser.email,
      hashedPassword: sqlUser.hashedPassword,
      emailValidationToken: sqlUser.emailValidationToken ?? undefined,
      signupDate: new Timestamp(sqlUser.createdAt),
    });
  }

  protected toSql(user: User): SqlUser {
    return Object.assign(new SqlUser(), {
      id: user.id,
      nick: user.nick.toString(),
      email: user.email,
      hashedPassword: user.hashedPassword,
      emailValidationToken: user.emailValidationToken ?? null,
      createdAt: user.signupDate.toDate(),
    });
  }

  async listUsers(): Promise<{ id: string }[]> {
    return this.repository.findAll();
  }

  async getUser(where: Partial<{ id: string; email: string }>): Promise<GetUserResult> {
    const user = await this.repository.findOne(where);

    if (!user) {
      throw new EntityNotFoundError(SqlUser.name, where);
    }

    return {
      id: user.id,
      nick: user.nick.toString(),
      email: user.email,
      profileImage: `/user/${user.id}/profile-image`,
      emailValidated: !user.emailValidationToken,
      signupDate: user.createdAt.toISOString(),
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const sqlUser = await this.repository.findOne({ email });

    if (sqlUser) {
      return this.toEntity(sqlUser);
    }
  }
}

injected(SqlUserRepository, PERSISTENCE_TOKENS.database);
