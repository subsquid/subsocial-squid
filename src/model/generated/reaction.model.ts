import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Post} from "./post.model"
import {Account} from "./account.model"
import {ReactionKind} from "./_reactionKind"
import {Status} from "./_status"

@Entity_()
export class Reaction {
  constructor(props?: Partial<Reaction>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Post, {nullable: false})
  post!: Post

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Index_()
  @Column_("varchar", {length: 8, nullable: false})
  kind!: ReactionKind

  @Index_()
  @Column_("varchar", {length: 7, nullable: false})
  status!: Status

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAtBlock!: bigint

  @Column_("timestamp with time zone", {nullable: false})
  createdAtTime!: Date

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  updatedAtBlock!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null
}
