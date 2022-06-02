import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class AccountFollowers {
  constructor(props?: Partial<AccountFollowers>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  followerAccount!: string

  @Column_("text", {nullable: false})
  followingAccount!: string
}
