/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm"
import { ID } from "../../core/types/id"
import { User } from "./user_entity"

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  content: string

  @Column({ default: false })
  read: boolean

  @ManyToOne(() => User)
  from: User

  @ManyToOne(() => User)
  to: User

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  static privateRoomFromUserIds = (ids: ID[]) => ids.join(",")
}
