import { Migration } from '@mikro-orm/migrations';

export class Migration20230326195901 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "nick" varchar(255) not null, "email" varchar(255) not null, "hashed_password" varchar(255) not null, "email_validation_token" varchar(255) null, constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "thread" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "author_id" varchar(255) not null, "description" varchar(255) not null, "text" text not null, "keywords" text[] not null, constraint "thread_pkey" primary key ("id"));');

    this.addSql('create table "notification" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "type" varchar(255) not null, "user_id" varchar(255) not null, "payload" jsonb null, "seen_at" timestamptz(0) null, constraint "notification_pkey" primary key ("id"));');

    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "thread_id" varchar(255) not null, "author_id" varchar(255) not null, "parent_id" varchar(255) null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('create table "reaction" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "user_id" varchar(255) not null, "comment_id" varchar(255) not null, "type" varchar(255) not null, constraint "reaction_pkey" primary key ("id"));');

    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "author_id" varchar(255) not null, "comment_id" varchar(255) not null, "text" text not null, constraint "message_pkey" primary key ("id"));');

    this.addSql('create table "comment_subscription" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "comment_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "comment_subscription_pkey" primary key ("id"));');

    this.addSql('create table "comment_report" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "comment_id" varchar(255) not null, "user_id" varchar(255) not null, "reason" varchar(255) null, constraint "comment_report_pkey" primary key ("id"));');

    this.addSql('create table "user_activity" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "type" varchar(255) not null, "user_id" varchar(255) not null, "payload" jsonb null, constraint "user_activity_pkey" primary key ("id"));');

    this.addSql('alter table "thread" add constraint "thread_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_id_foreign" foreign key ("parent_id") references "comment" ("id") on update cascade on delete set null;');

    this.addSql('alter table "reaction" add constraint "reaction_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "reaction" add constraint "reaction_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "message" add constraint "message_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "comment_subscription" add constraint "comment_subscription_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');
    this.addSql('alter table "comment_subscription" add constraint "comment_subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment_report" add constraint "comment_report_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');
    this.addSql('alter table "comment_report" add constraint "comment_report_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_activity" add constraint "user_activity_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
