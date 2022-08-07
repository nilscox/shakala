import { EntityManager } from '@mikro-orm/postgresql';
import { UserRepository } from 'backend-application';
import { Nick, User } from 'backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlUser } from '../entities/sql-user.entity';

export class SqlUserRepository extends BaseSqlRepository<SqlUser, User> implements UserRepository {
  constructor(em: EntityManager) {
    super(em, SqlUser);
  }

  protected get entityName(): string {
    return 'User';
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.toDomain(await this.repository.findOne({ email }));
  }

  async findByNick(nick: Nick): Promise<User | undefined> {
    return this.toDomain(await this.repository.findOne({ nick: nick.toString() }));
  }
}
