import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

// generate a migration for connect-pg-simple
// cspell:disable

@Entity({ tableName: 'session' })
export class SqlSession {
  @PrimaryKey({ columnType: 'varchar' })
  sid!: string;

  @Property({ columnType: 'json' })
  sess!: string;

  @Index({ name: 'IDX_session_expire' })
  @Property({ columnType: 'timestamp(6)' })
  expire!: Date;
}
