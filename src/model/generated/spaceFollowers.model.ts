import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {Space} from "./space.model"

@Entity_()
export class SpaceFollowers {
  constructor(props?: Partial<SpaceFollowers>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  followerAccount!: Account

  @Index_()
  @ManyToOne_(() => Space, {nullable: true})
  followingSpace!: Space
}
