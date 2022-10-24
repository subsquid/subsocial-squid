import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Space} from "./space.model"
import {PostKind} from "./_postKind"
import {PostFollowers} from "./postFollowers.model"
import {CommentFollowers} from "./commentFollowers.model"
import {Reaction} from "./reaction.model"

@Entity_()
export class Post {
  constructor(props?: Partial<Post>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Post, {nullable: true})
  parentPost!: Post | undefined | null

  @Index_()
  @ManyToOne_(() => Post, {nullable: true})
  rootPost!: Post | undefined | null

  @Index_()
  @ManyToOne_(() => Post, {nullable: true})
  sharedPost!: Post | undefined | null

  @Index_()
  @Column_("bool", {nullable: false})
  isComment!: boolean

  @Index_()
  @Column_("bool", {nullable: false})
  hidden!: boolean

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  ownedByAccount!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  createdByAccount!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Index_()
  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdOnDay!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null

  @Index_()
  @ManyToOne_(() => Space, {nullable: true})
  space!: Space | undefined | null

  @Index_()
  @Column_("varchar", {length: 11, nullable: true})
  kind!: PostKind | undefined | null

  @OneToMany_(() => PostFollowers, e => e.followingPost)
  postFollowers!: PostFollowers[]

  @OneToMany_(() => CommentFollowers, e => e.followingComment)
  commentFollowers!: CommentFollowers[]

  @Index_()
  @Column_("int4", {nullable: false})
  followersCount!: number

  @Column_("int4", {nullable: false})
  repliesCount!: number

  @Index_()
  @Column_("int4", {nullable: false})
  publicRepliesCount!: number

  @Column_("int4", {nullable: false})
  hiddenRepliesCount!: number

  @Index_()
  @Column_("int4", {nullable: false})
  sharesCount!: number

  @Index_()
  @Column_("int4", {nullable: false})
  upvotesCount!: number

  @Index_()
  @Column_("int4", {nullable: false})
  downvotesCount!: number

  @Index_()
  @Column_("int4", {nullable: false})
  reactionsCount!: number

  @OneToMany_(() => Reaction, e => e.post)
  reactions!: Reaction[]

  @Column_("text", {nullable: true})
  title!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  link!: string | undefined | null

  @Column_("text", {nullable: true})
  canonical!: string | undefined | null

  @Column_("text", {nullable: true})
  content!: string | undefined | null

  @Column_("text", {nullable: true})
  slug!: string | undefined | null

  @Column_("text", {nullable: true})
  body!: string | undefined | null

  @Column_("text", {nullable: true})
  summary!: string | undefined | null

  @Column_("text", {nullable: true})
  meta!: string | undefined | null

  @Column_("text", {nullable: true})
  tagsOriginal!: string | undefined | null

  @Column_("text", {nullable: true})
  format!: string | undefined | null

  @Column_("int4", {nullable: true})
  proposalIndex!: number | undefined | null
}
