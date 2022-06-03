import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {Activity} from "./activity.model"

@Entity_()
export class NewsFeed {
  constructor(props?: Partial<NewsFeed>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Index_()
  @ManyToOne_(() => Activity, {nullable: false})
  activity!: Activity
}
