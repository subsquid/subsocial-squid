import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Space} from "./space.model"
import {PostKind} from "./_postKind"
import {PostFollowers} from "./postFollowers.model"
import {CommentFollowers} from "./commentFollowers.model"

@Entity_()
export class Post {
  constructor(props?: Partial<Post>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  parentId!: string | undefined | null

  @Column_("text", {nullable: true})
  rootPostId!: string | undefined | null

  @Column_("text", {nullable: true})
  sharedPostId!: string | undefined | null

  @Column_("bool", {nullable: true})
  isComment!: boolean | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  createdByAccount!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdOnDay!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null

  @Index_()
  @ManyToOne_(() => Space, {nullable: true})
  space!: Space | undefined | null

  @Column_("varchar", {length: 11, nullable: true})
  kind!: PostKind | undefined | null

  @OneToMany_(() => PostFollowers, e => e.followingPost)
  postFollowers!: PostFollowers[]

  @OneToMany_(() => CommentFollowers, e => e.followingComment)
  commentFollowers!: CommentFollowers[]

  @Column_("int4", {nullable: true})
  repliesCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  publicRepliesCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  hiddenRepliesCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  sharesCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  upvotesCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  downvotesCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  score!: number | undefined | null

  @Column_("text", {nullable: true})
  title!: string | undefined | null

  @Column_("text", {nullable: true})
  content!: string | undefined | null

  @Column_("text", {nullable: true})
  slug!: string | undefined | null

  @Column_("text", {nullable: true})
  summary!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  canonical!: string | undefined | null

  @Column_("text", {nullable: true})
  tagsOriginal!: string | undefined | null

  @Column_("int4", {nullable: true})
  proposalIndex!: number | undefined | null
}
