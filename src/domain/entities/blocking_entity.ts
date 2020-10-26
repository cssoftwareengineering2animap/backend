/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm"
import { ID } from "../../core/types/id"
import { Host } from "./host_entity"
import { User } from "./user_entity"

@Entity()
export class Blocking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @ManyToOne(() => User, user => user.blockings, { cascade: true })
  user: User

  @ManyToOne(() => Host, host => host.blockings, { cascade: true })
  host: Host

  @CreateDateColumn({ name: "createdAt" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  public updatedAt: Date
}
