import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Activities} from "./activities.model"

@Entity_()
export class Notifications {
  constructor(props?: Partial<Notifications>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  account!: string

  @Index_()
  @ManyToOne_(() => Activities, {nullable: true})
  activity!: Activities | undefined | null
}
