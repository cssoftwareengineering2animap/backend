/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"
import { ID } from "../../core/types/id"
import { ChatMessage } from "./chat_message_entity"

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @OneToMany(() => ChatMessage, message => message.chat)
  messages: ChatMessage[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
