/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from "typeorm"
import { container } from "tsyringe"
import { ID } from "../../core/types/id"
import { File } from "./file_entity"
import { Pet } from "./pet_entity"
import { EncryptionProvider } from "../providers/encryption_provider"
import { Rating } from "./rating_entity"

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

  @OneToOne(() => File)
  profilePicture: File

  @OneToMany(() => Pet, pet => pet.owner)
  pets: Pet[]

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[]

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
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
