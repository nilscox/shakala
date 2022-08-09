import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

// generate a migration for connect-pg-simple
// cspell:disable

@Index({ name: 'IDX_session_expire', properties: ['expire'] })
@Entity({ tableName: 'session' })
export class SqlSession {
  @PrimaryKey({ columnType: 'varchar' })
  sid!: string;

  @Property({ columnType: 'json' })
  sess!: string;

  @Property({ columnType: 'timestamp(6)' })
  expire!: Date;
}
