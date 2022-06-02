import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class SpaceFollowers {
  constructor(props?: Partial<SpaceFollowers>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  followerAccount!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  followingSpaceId!: bigint
}
