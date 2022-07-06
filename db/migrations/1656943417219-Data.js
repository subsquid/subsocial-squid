module.exports = class Data1656943417219 {
  name = 'Data1656943417219'

  async up(db) {
    await db.query(`CREATE TABLE "account_followers" ("id" character varying NOT NULL, "follower_account_id" character varying NOT NULL, "following_account_id" character varying NOT NULL, CONSTRAINT "PK_dade5b6e74b543ca2ea018b5a5a" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_7bb4dcd7984d41c97348ceb69a" ON "account_followers" ("follower_account_id") `)
    await db.query(`CREATE INDEX "IDX_9130c3e03dd8405027b2855e18" ON "account_followers" ("following_account_id") `)
    await db.query(`CREATE TABLE "space_followers" ("id" character varying NOT NULL, "follower_account_id" character varying NOT NULL, "following_space_id" character varying NOT NULL, CONSTRAINT "PK_ff33678164d2cd02e1127098295" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_b99731dad3b444d673552a12e2" ON "space_followers" ("follower_account_id") `)
    await db.query(`CREATE INDEX "IDX_0fc0101129e59985a769c8d124" ON "space_followers" ("following_space_id") `)
    await db.query(`CREATE TABLE "space" ("id" character varying NOT NULL, "created_at_block" numeric, "created_at_time" TIMESTAMP WITH TIME ZONE, "created_on_day" TIMESTAMP WITH TIME ZONE, "updated_at_time" TIMESTAMP WITH TIME ZONE, "posts_count" integer, "public_posts_count" integer, "hidden_posts_count" integer, "content" text, "name" text, "image" text, "summary" text, "tags_original" text, "followers_count" integer, "created_by_account_id" character varying NOT NULL, "owner_account_id" character varying NOT NULL, CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_af311c75ea1208213e4db8df49" ON "space" ("created_by_account_id") `)
    await db.query(`CREATE INDEX "IDX_397dda73121b1bc9448b14646c" ON "space" ("owner_account_id") `)
    await db.query(`CREATE TABLE "post_followers" ("id" character varying NOT NULL, "follower_account_id" character varying NOT NULL, "following_post_id" character varying NOT NULL, CONSTRAINT "PK_ced73560f09ff759cf0d7590c8d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_5ba125d95c053ba440ac801ae1" ON "post_followers" ("follower_account_id") `)
    await db.query(`CREATE INDEX "IDX_2c149f02ff36804d9393709528" ON "post_followers" ("following_post_id") `)
    await db.query(`CREATE TABLE "comment_followers" ("id" character varying NOT NULL, "follower_account_id" character varying NOT NULL, "following_comment_id" character varying NOT NULL, CONSTRAINT "PK_bc06e7514ca9f7a7beb9b5d9d01" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_68bdb5fb30fa4a780b637a431c" ON "comment_followers" ("follower_account_id") `)
    await db.query(`CREATE INDEX "IDX_786ac17a6b890ba9a835ffab18" ON "comment_followers" ("following_comment_id") `)
    await db.query(`CREATE TABLE "reaction" ("id" character varying NOT NULL, "kind" character varying(8) NOT NULL, "status" character varying(7) NOT NULL, "created_at_block" numeric NOT NULL, "created_at_time" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at_block" numeric, "updated_at_time" TIMESTAMP WITH TIME ZONE, "post_id" character varying NOT NULL, "account_id" character varying NOT NULL, CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_4af0a7b3bc874c64e408aaa985" ON "reaction" ("post_id") `)
    await db.query(`CREATE INDEX "IDX_1fa27851b2897fc8a71a007283" ON "reaction" ("account_id") `)
    await db.query(`CREATE INDEX "IDX_caa8bfe29eb6373fc4a58c1af2" ON "reaction" ("status") `)
    await db.query(`CREATE TABLE "post" ("id" character varying NOT NULL, "is_comment" boolean NOT NULL, "hidden" boolean NOT NULL, "created_at_block" numeric, "created_at_time" TIMESTAMP WITH TIME ZONE, "created_on_day" TIMESTAMP WITH TIME ZONE, "updated_at_time" TIMESTAMP WITH TIME ZONE, "kind" character varying(11), "followers_count" integer, "replies_count" integer, "public_replies_count" integer, "hidden_replies_count" integer, "shares_count" integer, "upvotes_count" integer, "downvotes_count" integer, "reactions_count" integer, "title" text, "content" text, "slug" text, "summary" text, "image" text, "canonical" text, "tags_original" text, "proposal_index" integer, "parent_post_id" character varying, "root_post_id" character varying, "shared_post_id" character varying, "created_by_account_id" character varying NOT NULL, "space_id" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_0d4e62dcf3e5e150431136f114" ON "post" ("parent_post_id") `)
    await db.query(`CREATE INDEX "IDX_ea813cdf5e4158eb4eb24cd049" ON "post" ("root_post_id") `)
    await db.query(`CREATE INDEX "IDX_52122bf2cf235b80e8227a9c64" ON "post" ("shared_post_id") `)
    await db.query(`CREATE INDEX "IDX_9506f1c2a4fd7133f1d6732c46" ON "post" ("created_by_account_id") `)
    await db.query(`CREATE INDEX "IDX_4873b2ec27a93cd3f2518cb181" ON "post" ("space_id") `)
    await db.query(`CREATE TABLE "activity" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "event_index" integer NOT NULL, "event" character varying(19) NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "aggregated" boolean, "agg_count" numeric, "account_id" character varying NOT NULL, "following_account_id" character varying, "space_id" character varying, "space_prev_id" character varying, "post_id" character varying, "reaction_id" character varying, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_96c7c848eec1feba0bc66b4519" ON "activity" ("account_id") `)
    await db.query(`CREATE INDEX "IDX_2309bdad81af5f2780c902b358" ON "activity" ("following_account_id") `)
    await db.query(`CREATE INDEX "IDX_3fc93c9bf3004b3005fcba6fae" ON "activity" ("space_id") `)
    await db.query(`CREATE INDEX "IDX_aa427db0caf033cca82901385b" ON "activity" ("space_prev_id") `)
    await db.query(`CREATE INDEX "IDX_624114671c34d2515ec04c2c88" ON "activity" ("post_id") `)
    await db.query(`CREATE INDEX "IDX_b89929a58c06720ca096316ba9" ON "activity" ("reaction_id") `)
    await db.query(`CREATE TABLE "news_feed" ("id" character varying NOT NULL, "account_id" character varying NOT NULL, "activity_id" character varying NOT NULL, CONSTRAINT "PK_9325de5b82b32b083a96e63d8d8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_58688a6d8f474152cf47ab8283" ON "news_feed" ("account_id") `)
    await db.query(`CREATE INDEX "IDX_f2e2e6333cfd2b5248d7e12fb8" ON "news_feed" ("activity_id") `)
    await db.query(`CREATE TABLE "notification" ("id" character varying NOT NULL, "account_id" character varying NOT NULL, "activity_id" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_6bfa96ab97f1a09d73091294ef" ON "notification" ("account_id") `)
    await db.query(`CREATE INDEX "IDX_894ef2df998c9dbbdd45e39d88" ON "notification" ("activity_id") `)
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "reputation" integer, "has_profile" boolean, "name" text, "avatar" text, "about" text, "created_at_block" numeric, "created_at_time" TIMESTAMP WITH TIME ZONE, "followers_count" integer, "following_accounts_count" integer, "following_spaces_count" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "account_followers" ADD CONSTRAINT "FK_7bb4dcd7984d41c97348ceb69a2" FOREIGN KEY ("follower_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "account_followers" ADD CONSTRAINT "FK_9130c3e03dd8405027b2855e180" FOREIGN KEY ("following_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "space_followers" ADD CONSTRAINT "FK_b99731dad3b444d673552a12e2e" FOREIGN KEY ("follower_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "space_followers" ADD CONSTRAINT "FK_0fc0101129e59985a769c8d1243" FOREIGN KEY ("following_space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "space" ADD CONSTRAINT "FK_af311c75ea1208213e4db8df493" FOREIGN KEY ("created_by_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "space" ADD CONSTRAINT "FK_397dda73121b1bc9448b14646c8" FOREIGN KEY ("owner_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post_followers" ADD CONSTRAINT "FK_5ba125d95c053ba440ac801ae1f" FOREIGN KEY ("follower_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post_followers" ADD CONSTRAINT "FK_2c149f02ff36804d93937095280" FOREIGN KEY ("following_post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "comment_followers" ADD CONSTRAINT "FK_68bdb5fb30fa4a780b637a431c1" FOREIGN KEY ("follower_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "comment_followers" ADD CONSTRAINT "FK_786ac17a6b890ba9a835ffab18f" FOREIGN KEY ("following_comment_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_4af0a7b3bc874c64e408aaa9853" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_1fa27851b2897fc8a71a0072834" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_0d4e62dcf3e5e150431136f1149" FOREIGN KEY ("parent_post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_ea813cdf5e4158eb4eb24cd0495" FOREIGN KEY ("root_post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_52122bf2cf235b80e8227a9c645" FOREIGN KEY ("shared_post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_9506f1c2a4fd7133f1d6732c46e" FOREIGN KEY ("created_by_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_4873b2ec27a93cd3f2518cb1813" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_96c7c848eec1feba0bc66b45190" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_2309bdad81af5f2780c902b358f" FOREIGN KEY ("following_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_3fc93c9bf3004b3005fcba6fae6" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_aa427db0caf033cca82901385b1" FOREIGN KEY ("space_prev_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_624114671c34d2515ec04c2c88c" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_b89929a58c06720ca096316ba96" FOREIGN KEY ("reaction_id") REFERENCES "reaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "news_feed" ADD CONSTRAINT "FK_58688a6d8f474152cf47ab8283a" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "news_feed" ADD CONSTRAINT "FK_f2e2e6333cfd2b5248d7e12fb8b" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_6bfa96ab97f1a09d73091294efc" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_894ef2df998c9dbbdd45e39d884" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account_followers"`)
    await db.query(`DROP INDEX "public"."IDX_7bb4dcd7984d41c97348ceb69a"`)
    await db.query(`DROP INDEX "public"."IDX_9130c3e03dd8405027b2855e18"`)
    await db.query(`DROP TABLE "space_followers"`)
    await db.query(`DROP INDEX "public"."IDX_b99731dad3b444d673552a12e2"`)
    await db.query(`DROP INDEX "public"."IDX_0fc0101129e59985a769c8d124"`)
    await db.query(`DROP TABLE "space"`)
    await db.query(`DROP INDEX "public"."IDX_af311c75ea1208213e4db8df49"`)
    await db.query(`DROP INDEX "public"."IDX_397dda73121b1bc9448b14646c"`)
    await db.query(`DROP TABLE "post_followers"`)
    await db.query(`DROP INDEX "public"."IDX_5ba125d95c053ba440ac801ae1"`)
    await db.query(`DROP INDEX "public"."IDX_2c149f02ff36804d9393709528"`)
    await db.query(`DROP TABLE "comment_followers"`)
    await db.query(`DROP INDEX "public"."IDX_68bdb5fb30fa4a780b637a431c"`)
    await db.query(`DROP INDEX "public"."IDX_786ac17a6b890ba9a835ffab18"`)
    await db.query(`DROP TABLE "reaction"`)
    await db.query(`DROP INDEX "public"."IDX_4af0a7b3bc874c64e408aaa985"`)
    await db.query(`DROP INDEX "public"."IDX_1fa27851b2897fc8a71a007283"`)
    await db.query(`DROP INDEX "public"."IDX_caa8bfe29eb6373fc4a58c1af2"`)
    await db.query(`DROP TABLE "post"`)
    await db.query(`DROP INDEX "public"."IDX_0d4e62dcf3e5e150431136f114"`)
    await db.query(`DROP INDEX "public"."IDX_ea813cdf5e4158eb4eb24cd049"`)
    await db.query(`DROP INDEX "public"."IDX_52122bf2cf235b80e8227a9c64"`)
    await db.query(`DROP INDEX "public"."IDX_9506f1c2a4fd7133f1d6732c46"`)
    await db.query(`DROP INDEX "public"."IDX_4873b2ec27a93cd3f2518cb181"`)
    await db.query(`DROP TABLE "activity"`)
    await db.query(`DROP INDEX "public"."IDX_96c7c848eec1feba0bc66b4519"`)
    await db.query(`DROP INDEX "public"."IDX_2309bdad81af5f2780c902b358"`)
    await db.query(`DROP INDEX "public"."IDX_3fc93c9bf3004b3005fcba6fae"`)
    await db.query(`DROP INDEX "public"."IDX_aa427db0caf033cca82901385b"`)
    await db.query(`DROP INDEX "public"."IDX_624114671c34d2515ec04c2c88"`)
    await db.query(`DROP INDEX "public"."IDX_b89929a58c06720ca096316ba9"`)
    await db.query(`DROP TABLE "news_feed"`)
    await db.query(`DROP INDEX "public"."IDX_58688a6d8f474152cf47ab8283"`)
    await db.query(`DROP INDEX "public"."IDX_f2e2e6333cfd2b5248d7e12fb8"`)
    await db.query(`DROP TABLE "notification"`)
    await db.query(`DROP INDEX "public"."IDX_6bfa96ab97f1a09d73091294ef"`)
    await db.query(`DROP INDEX "public"."IDX_894ef2df998c9dbbdd45e39d88"`)
    await db.query(`DROP TABLE "account"`)
    await db.query(`ALTER TABLE "account_followers" DROP CONSTRAINT "FK_7bb4dcd7984d41c97348ceb69a2"`)
    await db.query(`ALTER TABLE "account_followers" DROP CONSTRAINT "FK_9130c3e03dd8405027b2855e180"`)
    await db.query(`ALTER TABLE "space_followers" DROP CONSTRAINT "FK_b99731dad3b444d673552a12e2e"`)
    await db.query(`ALTER TABLE "space_followers" DROP CONSTRAINT "FK_0fc0101129e59985a769c8d1243"`)
    await db.query(`ALTER TABLE "space" DROP CONSTRAINT "FK_af311c75ea1208213e4db8df493"`)
    await db.query(`ALTER TABLE "space" DROP CONSTRAINT "FK_397dda73121b1bc9448b14646c8"`)
    await db.query(`ALTER TABLE "post_followers" DROP CONSTRAINT "FK_5ba125d95c053ba440ac801ae1f"`)
    await db.query(`ALTER TABLE "post_followers" DROP CONSTRAINT "FK_2c149f02ff36804d93937095280"`)
    await db.query(`ALTER TABLE "comment_followers" DROP CONSTRAINT "FK_68bdb5fb30fa4a780b637a431c1"`)
    await db.query(`ALTER TABLE "comment_followers" DROP CONSTRAINT "FK_786ac17a6b890ba9a835ffab18f"`)
    await db.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_4af0a7b3bc874c64e408aaa9853"`)
    await db.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_1fa27851b2897fc8a71a0072834"`)
    await db.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_0d4e62dcf3e5e150431136f1149"`)
    await db.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_ea813cdf5e4158eb4eb24cd0495"`)
    await db.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_52122bf2cf235b80e8227a9c645"`)
    await db.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9506f1c2a4fd7133f1d6732c46e"`)
    await db.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_4873b2ec27a93cd3f2518cb1813"`)
    await db.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_96c7c848eec1feba0bc66b45190"`)
    await db.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_2309bdad81af5f2780c902b358f"`)
    await db.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_3fc93c9bf3004b3005fcba6fae6"`)
    await db.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_aa427db0caf033cca82901385b1"`)
    await db.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_624114671c34d2515ec04c2c88c"`)
    await db.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_b89929a58c06720ca096316ba96"`)
    await db.query(`ALTER TABLE "news_feed" DROP CONSTRAINT "FK_58688a6d8f474152cf47ab8283a"`)
    await db.query(`ALTER TABLE "news_feed" DROP CONSTRAINT "FK_f2e2e6333cfd2b5248d7e12fb8b"`)
    await db.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_6bfa96ab97f1a09d73091294efc"`)
    await db.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_894ef2df998c9dbbdd45e39d884"`)
  }
}