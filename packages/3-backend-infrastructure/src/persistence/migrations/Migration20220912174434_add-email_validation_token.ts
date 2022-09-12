import { Migration } from '@mikro-orm/migrations';

export class Migration20220912174434 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index "IDX_session_expire";');

    this.addSql('alter table "user" add column "email_validation_token" varchar(255) null;');
  }

  override async down(): Promise<void> {
    this.addSql('create index "IDX_session_expire" on "session" ("expire");');

    this.addSql('alter table "user" drop column "email_validation_token";');
  }

}
