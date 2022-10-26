import { Migration } from '@mikro-orm/migrations';

export class Migration20221025181916 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "notification" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "type" varchar(255) not null, "user_id" varchar(255) not null, "seen_at" timestamp null, "payload" jsonb not null, constraint "notification_pkey" primary key ("id"));');

    this.addSql('alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "notification" cascade;');
  }

}
