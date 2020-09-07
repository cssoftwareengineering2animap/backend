import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ID } from "../../core/types/id"

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  key: string

  @Column()
  url: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
