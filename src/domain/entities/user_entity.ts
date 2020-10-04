/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { container } from "tsyringe"
import { ID } from "../../core/types/id"
import { File } from "./file_entity"
import { Pet } from "./pet_entity"
import { EncryptionProvider } from "../providers/encryption_provider"
import { Rating } from "./rating_entity"
import { UserBlocking } from "./user_blocking_entity"

const encryptionProvider = container.resolve<EncryptionProvider>(
  "EncryptionProvider"
)

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column({ select: false, nullable: false })
  password?: string

  @ManyToMany(() => File)
  @JoinTable()
  pictures: Promise<File[]>

  @OneToMany(() => Pet, pet => pet.owner)
  pets: Promise<Pet[]>

  @ManyToMany(() => Rating, rating => rating.user)
  @JoinTable()
  ratings: Promise<Rating[]>

  @OneToMany(() => Rating, rating => rating.grader)
  gradings: Promise<Rating[]>

  @OneToMany(() => UserBlocking, blocking => blocking.blocker)
  blocks: Promise<UserBlocking[]>

  @CreateDateColumn({ name: "createdAt" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  public updatedAt: Date

  @BeforeUpdate()
  @BeforeInsert()
  public async hashPassword() {
    if (!this.password) {
      return
    }

    this.password = await encryptionProvider.hash(this.password)
  }
}
