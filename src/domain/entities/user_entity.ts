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
import { ID } from "../../core/types"
import { EncryptionProvider, EncryptionProviderToken } from "../providers"
import { Rating, Pet, Blocking, File } from "."

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column({ unique: true })
  email: string

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

  @OneToMany(() => Blocking, blocking => blocking.user)
  blockings: Promise<Blocking[]>

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

    const encryptionProvider = container.resolve<EncryptionProvider>(
      EncryptionProviderToken
    )

    this.password = await encryptionProvider.hash(this.password)
  }
}
