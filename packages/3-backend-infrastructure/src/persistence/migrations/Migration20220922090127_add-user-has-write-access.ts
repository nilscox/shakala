import { Migration } from '@mikro-orm/migrations';

export class Migration20220922090127 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "has_write_access" boolean not null default true;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "user" drop column "has_write_access";');
  }

}
