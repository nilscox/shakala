import { Migration } from '@mikro-orm/migrations';

export class Migration20220808001054 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "comment_id" varchar(255) not null, "text" text not null, "date" timestamptz(0) not null, constraint "message_pkey" primary key ("id"));');

    this.addSql('alter table "message" add constraint "message_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "comment" drop column "text";');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "message" cascade;');

    this.addSql('alter table "comment" add column "text" text not null default null;');
  }

}
