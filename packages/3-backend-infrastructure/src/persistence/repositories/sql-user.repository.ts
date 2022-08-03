import { EntityManager } from '@mikro-orm/postgresql';
import { UserRepository } from 'backend-application';
import { Nick, ProfileImage, Timestamp, User } from 'backend-domain';

import { EntityMapper } from '../base-classes/entity-mapper';
import { SqlRepository } from '../base-classes/sql-repository';
import { User as SqlUser } from '../entities/sql-user.entity';

export class SqlUserRepository extends SqlRepository<SqlUser, User> implements UserRepository {
  constructor(em: EntityManager) {
    super(em.getRepository(SqlUser), new UserEntityMapper());
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findBy({ email });
  }

  async findByNick(nick: Nick): Promise<User | undefined> {
    return this.findBy({ nick: nick.toString() });
  }
}

export class UserEntityMapper implements EntityMapper<SqlUser, User> {
  toSql(entity: User): SqlUser {
    const sqlUser = new SqlUser();

    sqlUser.id = entity.id;
    sqlUser.email = entity.email;
    sqlUser.hashedPassword = entity.hashedPassword;
    sqlUser.nick = entity.nick.toString();
    sqlUser.profileImage = entity.profileImage.toString() ?? undefined;
    sqlUser.signupDate = entity.signupDate.toDate();
    sqlUser.lastLoginDate = entity.lastLoginDate?.toDate();

    return sqlUser;
  }

  fromSql(sqlEntity: SqlUser): User {
    return new User({
      id: sqlEntity.id,
      email: sqlEntity.email,
      hashedPassword: sqlEntity.hashedPassword,
      nick: new Nick(sqlEntity.nick),
      profileImage: new ProfileImage(sqlEntity.profileImage),
      signupDate: new Timestamp(sqlEntity.signupDate),
      lastLoginDate: sqlEntity.lastLoginDate ? new Timestamp(sqlEntity.lastLoginDate) : null,
    });
  }
}
