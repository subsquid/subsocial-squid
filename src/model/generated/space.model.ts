import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {SpaceFollowers} from "./spaceFollowers.model"

@Entity_()
export class Space {
  constructor(props?: Partial<Space>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  createdByAccount!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  ownerAccount!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdOnDay!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null

  @Column_("int4", {nullable: true})
  postsCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  publicPostsCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  hiddenPostsCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  score!: number | undefined | null

  @Column_("text", {nullable: true})
  content!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  summary!: string | undefined | null

  @Column_("text", {nullable: true})
  tagsOriginal!: string | undefined | null

  @Column_("int4", {nullable: true})
  followersCount!: number | undefined | null

  @OneToMany_(() => SpaceFollowers, e => e.followingSpace)
  followers!: SpaceFollowers[]
}
