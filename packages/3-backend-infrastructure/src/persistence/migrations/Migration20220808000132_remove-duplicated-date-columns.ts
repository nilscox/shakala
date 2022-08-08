import { Migration } from '@mikro-orm/migrations';

export class Migration20220808000132 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "signup_date";');

    this.addSql('alter table "thread" drop column "created";');

    this.addSql('alter table "comment" drop column "created";');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "comment" add column "created" timestamptz not null default null;');

    this.addSql('alter table "thread" add column "created" timestamptz not null default null;');

    this.addSql('alter table "user" add column "signup_date" timestamptz not null default null;');
  }

}
