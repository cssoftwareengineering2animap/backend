/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ID } from "../../core/types/id"
import { File } from "./file_entity"
import { Rating } from "./rating_entity"
import { User } from "./user_entity"

@Entity()
export class Pet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column()
  birthday: Date

  @Column()
  sex: "male" | "female"

  @Column()
  type: string

  @OneToOne(() => File)
  profilePicture: File

  @ManyToOne(() => User, user => user.pets, { cascade: true })
  owner: User

  @ManyToMany(() => File)
  @JoinTable()
  pictures: Promise<File[]>
  // passeios[Relação]

  @ManyToMany(() => Rating, rating => rating.pet)
  @JoinTable()
  ratings: Promise<Rating[]>

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date
}
