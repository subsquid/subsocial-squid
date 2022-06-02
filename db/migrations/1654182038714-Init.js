module.exports = class Init1654182038714 {
  name = 'Init1654182038714'

  async up(db) {
    await db.query(`CREATE TABLE "account_followers" ("id" character varying NOT NULL, "follower_account" text NOT NULL, "following_account" text NOT NULL, CONSTRAINT "PK_dade5b6e74b543ca2ea018b5a5a" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "space_followers" ("id" character varying NOT NULL, "follower_account" text NOT NULL, "following_space_id" numeric NOT NULL, CONSTRAINT "PK_ff33678164d2cd02e1127098295" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "post_followers" ("id" character varying NOT NULL, "follower_account" text NOT NULL, "following_post_id" numeric NOT NULL, CONSTRAINT "PK_ced73560f09ff759cf0d7590c8d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "comment_followers" ("id" character varying NOT NULL, "follower_account" text NOT NULL, "following_comment_id" numeric NOT NULL, CONSTRAINT "PK_bc06e7514ca9f7a7beb9b5d9d01" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "notifications" ("id" character varying NOT NULL, "account" text NOT NULL, "activity_id" character varying, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_e224c516b037619aaa206e8468" ON "notifications" ("activity_id") `)
    await db.query(`CREATE TABLE "news_feed" ("id" character varying NOT NULL, "account" text NOT NULL, "activity_id" character varying, CONSTRAINT "PK_9325de5b82b32b083a96e63d8d8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_f2e2e6333cfd2b5248d7e12fb8" ON "news_feed" ("activity_id") `)
    await db.query(`CREATE TABLE "activities" ("id" character varying NOT NULL, "account" text NOT NULL, "block_number" numeric NOT NULL, "event_index" integer NOT NULL, "event" character varying(19) NOT NULL, "following_id" text, "space_id" numeric, "post_id" numeric, "comment_id" numeric, "parent_comment_id" numeric, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "aggregated" boolean NOT NULL, "agg_count" numeric NOT NULL, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_e224c516b037619aaa206e8468b" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "news_feed" ADD CONSTRAINT "FK_f2e2e6333cfd2b5248d7e12fb8b" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account_followers"`)
    await db.query(`DROP TABLE "space_followers"`)
    await db.query(`DROP TABLE "post_followers"`)
    await db.query(`DROP TABLE "comment_followers"`)
    await db.query(`DROP TABLE "notifications"`)
    await db.query(`DROP INDEX "public"."IDX_e224c516b037619aaa206e8468"`)
    await db.query(`DROP TABLE "news_feed"`)
    await db.query(`DROP INDEX "public"."IDX_f2e2e6333cfd2b5248d7e12fb8"`)
    await db.query(`DROP TABLE "activities"`)
    await db.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_e224c516b037619aaa206e8468b"`)
    await db.query(`ALTER TABLE "news_feed" DROP CONSTRAINT "FK_f2e2e6333cfd2b5248d7e12fb8b"`)
  }
}
