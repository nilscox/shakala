import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// generate a migration for connect-pg-simple
// cspell:disable

@Entity({ tableName: 'session' })
export class SqlSession {
  @PrimaryKey({ columnType: 'varchar' })
  sid!: string;

  @Property({ columnType: 'json' })
  sess!: string;

  @Property({ columnType: 'timestamp(6)' })
  expire!: Date;
}
