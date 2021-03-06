import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {AccountFollowers} from "./accountFollowers.model"
import {Post} from "./post.model"
import {Space} from "./space.model"
import {SpaceFollowers} from "./spaceFollowers.model"
import {NewsFeed} from "./newsFeed.model"
import {Notification} from "./notification.model"
import {Activity} from "./activity.model"
import {Reaction} from "./reaction.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: true})
  reputation!: number | undefined | null

  @Index_()
  @Column_("bool", {nullable: true})
  hasProfile!: boolean | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  avatar!: string | undefined | null

  @Column_("text", {nullable: true})
  about!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @OneToMany_(() => AccountFollowers, e => e.followingAccount)
  followers!: AccountFollowers[]

  @Column_("int4", {nullable: false})
  followersCount!: number

  @OneToMany_(() => AccountFollowers, e => e.followerAccount)
  followingAccounts!: AccountFollowers[]

  @Column_("int4", {nullable: false})
  followingAccountsCount!: number

  @OneToMany_(() => Post, e => e.createdByAccount)
  posts!: Post[]

  @OneToMany_(() => Space, e => e.createdByAccount)
  spacesCreated!: Space[]

  @OneToMany_(() => Space, e => e.ownerAccount)
  spacesOwned!: Space[]

  @OneToMany_(() => SpaceFollowers, e => e.followerAccount)
  spacesFollowed!: SpaceFollowers[]

  @Column_("int4", {nullable: false})
  followingSpacesCount!: number

  @OneToMany_(() => NewsFeed, e => e.account)
  feeds!: NewsFeed[]

  @OneToMany_(() => Notification, e => e.account)
  notifications!: Notification[]

  @OneToMany_(() => Activity, e => e.account)
  activities!: Activity[]

  @OneToMany_(() => Reaction, e => e.account)
  reactions!: Reaction[]
}
