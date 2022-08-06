import { Migration } from '@mikro-orm/migrations';

export class Migration20220806134553 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "thread" add column "description" varchar(255) not null, add column "keywords" character varying(255) array not null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "thread" drop column "description";');
    this.addSql('alter table "thread" drop column "keywords";');
  }

}
