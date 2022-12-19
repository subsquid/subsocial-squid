import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {Post} from "./post.model"

@Entity_()
export class PostFollowers {
    constructor(props?: Partial<PostFollowers>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    followerAccount!: Account

    @Index_()
    @ManyToOne_(() => Post, {nullable: true})
    followingPost!: Post
}
