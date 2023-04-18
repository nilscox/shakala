import { Migration } from '@mikro-orm/migrations';

// cspell:word sess

export class Migration20230403114317 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "profile_image" cascade;');

    this.addSql('drop table if exists "session" cascade;');

    this.addSql('alter table "user" drop column "profile_image";');

    this.addSql('alter table "message" drop column "date";');
  }

  async down(): Promise<void> {
    this.addSql('create table "profile_image" ("name" varchar not null default null, "type" text check ("type" in (\'png\', \'jpg\', \'bmp\')) not null default null, "data" bytea not null default null, "user_id" varchar not null default null, "created_at" timestamp not null default null, "updated_at" timestamp not null default null, constraint "profile_image_pkey" primary key ("name"));');

    this.addSql('create table "session" ("sid" varchar not null default null, "sess" json not null default null, "expire" timestamp not null default null, constraint "session_pkey" primary key ("sid"));');

    this.addSql('alter table "profile_image" add constraint "profile_image_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete no action;');

    this.addSql('alter table "message" add column "date" timestamptz not null default null;');

    this.addSql('alter table "user" add column "profile_image" varchar null default null;');
    this.addSql('alter table "user" alter column "has_write_access" type bool using ("has_write_access"::bool);');
    this.addSql('alter table "user" alter column "has_write_access" set default true;');
  }

}
