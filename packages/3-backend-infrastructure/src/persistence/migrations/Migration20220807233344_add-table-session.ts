import { Migration } from '@mikro-orm/migrations';

// cspell:disable
export class Migration20220807233344 extends Migration {

  async up(): Promise<void> {
    this.addSql(`
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
    `);
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "session" cascade;');
    this.addSql('drop index if exists "IDX_session_expire" cascade;');
  }

}
