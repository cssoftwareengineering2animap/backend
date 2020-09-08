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
import { Chat } from "./chat_entity"

@Entity()
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  content: string

  @ManyToOne(() => Chat, chat => chat.messages)
  chat: Chat

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
