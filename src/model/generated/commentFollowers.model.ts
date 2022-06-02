import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class CommentFollowers {
  constructor(props?: Partial<CommentFollowers>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  followerAccount!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  followingCommentId!: bigint
}
