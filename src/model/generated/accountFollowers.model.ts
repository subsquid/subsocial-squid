import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"

@Entity_()
export class AccountFollowers {
    constructor(props?: Partial<AccountFollowers>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    followerAccount!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    followingAccount!: Account
}
