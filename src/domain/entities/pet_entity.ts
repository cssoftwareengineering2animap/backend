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
  OneToMany,
} from "typeorm"
import { ID } from "../../core/types/id"
import { File } from "./file_entity"
import { Rating } from "./rating_entity"
import { Tour } from "./tour_entity"
import { User } from "./user_entity"

@Entity()
export class Pet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column()
  age: number

  @Column()
  type: string

  @Column({ nullable: true })
  observations: string

  @OneToOne(() => File)
  profilePicture: File

  @Column()
  ownerId: ID

  @ManyToOne(() => User, user => user.pets, { cascade: true })
  owner: User

  @ManyToMany(() => File)
  @JoinTable()
  pictures: Promise<File[]>

  @ManyToMany(() => Rating, rating => rating.pet)
  @JoinTable()
  ratings: Promise<Rating[]>

  @OneToMany(() => Tour, tour => tour.pet)
  tours: Tour[]

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date
}
