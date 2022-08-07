import { Migration } from '@mikro-orm/migrations';

export class Migration20220807122436 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "comment_id" varchar(255) not null, "text" text not null, "date" timestamptz(0) not null, constraint "message_pkey" primary key ("id"));');

    this.addSql('alter table "message" add constraint "message_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "user" drop column "signup_date";');

    this.addSql('alter table "thread" add column "description" varchar(255) not null, add column "keywords" character varying(255) array not null;');
    this.addSql('alter table "thread" drop column "created";');

    this.addSql('alter table "comment" drop column "text";');
    this.addSql('alter table "comment" drop column "created";');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "message" cascade;');

    this.addSql('alter table "comment" add column "text" text not null default null, add column "created" timestamptz not null default null;');

    this.addSql('alter table "thread" add column "created" timestamptz not null default null;');
    this.addSql('alter table "thread" drop column "description";');
    this.addSql('alter table "thread" drop column "keywords";');

    this.addSql('alter table "user" add column "signup_date" timestamptz not null default null;');
  }

}
