/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from "typeorm"
import { ID } from "../../core/types/id"
import { User } from "./user_entity"

@Entity()
export class UserBlocking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @ManyToOne(() => User, user => user.blockedUsers, { cascade: true })
  blocker: User

  @ManyToOne(() => User, user => user.blockedByUsers, { cascade: true })
  blocked: User

  @CreateDateColumn({ name: "createdAt" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  public updatedAt: Date
}
