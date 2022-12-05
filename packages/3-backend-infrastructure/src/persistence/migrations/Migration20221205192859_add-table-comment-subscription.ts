import { Migration } from '@mikro-orm/migrations';

export class Migration20221205192859 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment_subscription" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "comment_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "comment_subscription_pkey" primary key ("id"));');

    this.addSql('alter table "comment_subscription" add constraint "comment_subscription_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');
    this.addSql('alter table "comment_subscription" add constraint "comment_subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment_subscription" cascade;');
  }

}
