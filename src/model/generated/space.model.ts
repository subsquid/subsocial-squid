import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Post} from "./post.model"
import {SpacePermissions} from "./_spacePermissions"
import {SpaceFollowers} from "./spaceFollowers.model"

@Entity_()
export class Space {
  constructor(props?: Partial<Space>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  createdByAccount!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  ownedByAccount!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  profileSpace!: Account | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Index_()
  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdOnDay!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  updatedAtBlock!: bigint | undefined | null

  @OneToMany_(() => Post, e => e.space)
  posts!: Post[]

  @Column_("int4", {nullable: false})
  postsCount!: number

  @Index_()
  @Column_("int4", {nullable: false})
  publicPostsCount!: number

  @Column_("int4", {nullable: false})
  hiddenPostsCount!: number

  @Index_()
  @Column_("bool", {nullable: false})
  hidden!: boolean

  @Column_("text", {nullable: true})
  content!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  about!: string | undefined | null

  @Column_("text", {nullable: true})
  summary!: string | undefined | null

  @Column_("text", {nullable: true})
  email!: string | undefined | null

  @Column_("text", {nullable: true})
  tagsOriginal!: string | undefined | null

  @Column_("text", {nullable: true})
  linksOriginal!: string | undefined | null

  @Column_("text", {nullable: true})
  format!: string | undefined | null

  @Column_("bool", {nullable: true})
  canFollowerCreatePosts!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  canEveryoneCreatePosts!: boolean | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new SpacePermissions(undefined, obj)}, nullable: true})
  nonePermissions!: SpacePermissions | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new SpacePermissions(undefined, obj)}, nullable: true})
  everyonePermissions!: SpacePermissions | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new SpacePermissions(undefined, obj)}, nullable: true})
  followerPermissions!: SpacePermissions | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new SpacePermissions(undefined, obj)}, nullable: true})
  spaceOwnerPermissions!: SpacePermissions | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  followersCount!: number

  @OneToMany_(() => SpaceFollowers, e => e.followingSpace)
  followers!: SpaceFollowers[]
}
