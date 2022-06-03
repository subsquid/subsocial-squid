import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {EventAction} from "./_eventAction"

@Entity_()
export class Activity {
  constructor(props?: Partial<Activity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  blockNumber!: bigint

  @Column_("int4", {nullable: false})
  eventIndex!: number

  @Column_("varchar", {length: 19, nullable: false})
  event!: EventAction

  @Column_("text", {nullable: true})
  followingId!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  spaceId!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  postId!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  commentId!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  parentCommentId!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  date!: Date

  @Column_("bool", {nullable: false})
  aggregated!: boolean

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  aggCount!: bigint
}
