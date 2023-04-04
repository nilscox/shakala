import { Migration } from '@mikro-orm/migrations';

export class Migration20220924104958 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment_report" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "comment_id" varchar(255) not null, "reported_by_id" varchar(255) not null, "reason" varchar(255) null, constraint "comment_report_pkey" primary key ("id"));');

    this.addSql('alter table "comment_report" add constraint "comment_report_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');
    this.addSql('alter table "comment_report" add constraint "comment_report_reported_by_id_foreign" foreign key ("reported_by_id") references "user" ("id") on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "comment_report" cascade;');
  }

}
