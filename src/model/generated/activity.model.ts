import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {EventName} from "./_eventName"
import {Space} from "./space.model"
import {Post} from "./post.model"
import {Reaction} from "./reaction.model"

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
  event!: EventName

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  followingAccount!: Account | undefined | null

  @Index_()
  @ManyToOne_(() => Space, {nullable: true})
  space!: Space | undefined | null

  @Index_()
  @ManyToOne_(() => Post, {nullable: true})
  post!: Post | undefined | null

  @Index_()
  @ManyToOne_(() => Reaction, {nullable: true})
  reaction!: Reaction | undefined | null

  @Index_()
  @ManyToOne_(() => Post, {nullable: true})
  commentPost!: Post | undefined | null

  @Index_()
  @ManyToOne_(() => Post, {nullable: true})
  commentParentPost!: Post | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  date!: Date

  @Column_("bool", {nullable: true})
  aggregated!: boolean | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  aggCount!: bigint | undefined | null
}
