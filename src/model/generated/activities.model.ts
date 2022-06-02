import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Notifications} from "./notifications.model"
import {NewsFeed} from "./newsFeed.model"
import {EventAction} from "./_eventAction"

@Entity_()
export class Activities {
  constructor(props?: Partial<Activities>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  account!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  blockNumber!: bigint

  @Column_("int4", {nullable: false})
  eventIndex!: number

  @OneToMany_(() => Notifications, e => e.activity)
  notifications!: Notifications[]

  @OneToMany_(() => NewsFeed, e => e.activity)
  feeds!: NewsFeed[]

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
