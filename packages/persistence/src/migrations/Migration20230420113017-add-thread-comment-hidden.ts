import { Migration } from '@mikro-orm/migrations';

export class Migration20230420113017 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "thread" add column "hidden" boolean not null default false;');
    this.addSql('alter table "comment" add column "hidden" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop column "hidden";');
    this.addSql('alter table "thread" drop column "hidden";');
  }

}
