import { Migration } from '@mikro-orm/migrations';

export class Migration20220808000813 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "thread" add column "description" varchar(255) not null, add column "keywords" text[] not null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "thread" drop column "description";');
    this.addSql('alter table "thread" drop column "keywords";');
  }

}
