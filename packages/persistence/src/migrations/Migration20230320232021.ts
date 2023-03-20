import { Migration } from '@mikro-orm/migrations';

export class Migration20230320232021 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "nick" varchar(255) not null, "email" varchar(255) not null, "hashed_password" varchar(255) not null, "email_validation_token" varchar(255) null, constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "thread" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "author_id" varchar(255) not null, "description" varchar(255) not null, "text" text not null, "keywords" text[] not null, constraint "thread_pkey" primary key ("id"));');

    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "thread_id" varchar(255) not null, "author_id" varchar(255) not null, "parent_id" varchar(255) null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('create table "reaction" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "user_id" varchar(255) not null, "comment_id" varchar(255) not null, "type" varchar(255) not null, constraint "reaction_pkey" primary key ("id"));');

    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "comment_id" varchar(255) not null, "text" text not null, constraint "message_pkey" primary key ("id"));');

    this.addSql('alter table "thread" add constraint "thread_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_id_foreign" foreign key ("parent_id") references "comment" ("id") on update cascade on delete set null;');

    this.addSql('alter table "reaction" add constraint "reaction_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "reaction" add constraint "reaction_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "message" add constraint "message_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');
  }

}
