import { Migration } from '@mikro-orm/migrations';

export class Migration20220831182707 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "created_at" type timestamp using ("created_at"::timestamp);');
    this.addSql('alter table "user" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');

    this.addSql('alter table "thread" alter column "created_at" type timestamp using ("created_at"::timestamp);');
    this.addSql('alter table "thread" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');

    this.addSql('alter table "comment" alter column "created_at" type timestamp using ("created_at"::timestamp);');
    this.addSql('alter table "comment" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');

    this.addSql('alter table "reaction" alter column "created_at" type timestamp using ("created_at"::timestamp);');
    this.addSql('alter table "reaction" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');

    this.addSql('alter table "message" alter column "created_at" type timestamp using ("created_at"::timestamp);');
    this.addSql('alter table "message" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "comment" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "comment" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "message" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "message" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "reaction" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "reaction" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "thread" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "thread" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
  }

}
