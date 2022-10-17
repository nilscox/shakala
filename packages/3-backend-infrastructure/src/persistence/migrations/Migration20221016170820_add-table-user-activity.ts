import { Migration } from '@mikro-orm/migrations';

export class Migration20221016170820 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_activity" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "type" varchar(255) not null, "user_id" varchar(255) not null, "payload" jsonb null, constraint "user_activity_pkey" primary key ("id"));');

    this.addSql('alter table "user_activity" add constraint "user_activity_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "user_activity" cascade;');
  }

}
