import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {AccountFollowers} from "./accountFollowers.model"
import {NewsFeed} from "./newsFeed.model"
import {Notification} from "./notification.model"
import {Post} from "./post.model"
import {Space} from "./space.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @OneToMany_(() => AccountFollowers, e => e.followingAccount)
  followers!: AccountFollowers[]

  @OneToMany_(() => NewsFeed, e => e.account)
  feeds!: NewsFeed[]

  @OneToMany_(() => Notification, e => e.account)
  notifications!: Notification[]

  @OneToMany_(() => Post, e => e.createdByAccount)
  posts!: Post[]

  @OneToMany_(() => Space, e => e.createdByAccount)
  spacesCreated!: Space[]

  @OneToMany_(() => Space, e => e.ownerAccount)
  spacesOwned!: Space[]
}
