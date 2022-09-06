import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Space} from "./space.model"
import {AccountFollowers} from "./accountFollowers.model"
import {Post} from "./post.model"
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

  @Index_()
  @ManyToOne_(() => Space, {nullable: true})
  profileSpace!: Space | undefined | null

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

  @Column_("int4", {nullable: false})
  followingPostsCount!: number

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
