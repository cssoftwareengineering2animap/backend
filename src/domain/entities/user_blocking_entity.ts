import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm"
import { ID } from "../../core/types/id"
import { User } from "./user_entity"

@Entity()
export class UserBlocking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @OneToMany(() => User, user => user.blocks)
  blocker: User

  @OneToOne(() => User)
  blocked: User

  @CreateDateColumn({ name: "createdAt" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  public updatedAt: Date
}
