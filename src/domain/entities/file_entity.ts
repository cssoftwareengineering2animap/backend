/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  AfterLoad,
} from "typeorm"
import { ID } from "../../core/types/id"
import { User } from "./user_entity"
import { env } from "../../config/env"

const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"] as const

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column()
  key: string

  @Column()
  url: string

  @Column()
  displayOrder: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @ManyToMany(() => User, { cascade: true })
  users: User[]

  public static isMimeAllowed = (mime: typeof allowedMimes[number]) =>
    allowedMimes.includes(mime)

  @AfterLoad()
  getUrl() {
    if (/test|dev/.test(env.NODE_ENV)) {
      this.url = `${env.HOST}/public/${this.key}`
    }
  }
}
