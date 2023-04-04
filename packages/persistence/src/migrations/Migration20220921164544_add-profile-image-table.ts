import { Migration } from '@mikro-orm/migrations';

export class Migration20220921164544 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "profile_image" ("name" varchar(255) not null, "type" text check ("type" in (\'png\', \'jpg\', \'bmp\')) not null, "data" bytea not null, "user_id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, constraint "profile_image_pkey" primary key ("name"));');

    this.addSql('alter table "profile_image" add constraint "profile_image_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "profile_image" cascade;');
  }

}
