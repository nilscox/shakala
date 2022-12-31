import { EntityManager } from '@mikro-orm/postgresql';
import { UserRepository } from '@shakala/backend-application';
import { DomainDependencies, Nick, User } from '@shakala/backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlUser } from '../entities/sql-user.entity';

export class SqlUserRepository extends BaseSqlRepository<SqlUser, User> implements UserRepository {
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlUser);
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
