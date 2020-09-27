/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  ManyToMany,
} from "typeorm"
import { ID } from "../../core/types/id"
import { User } from "./user_entity"
import { Pet } from "./pet_entity"

@Entity()
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  stars: number

  @ManyToMany(() => User, user => user.ratings)
  user: User[]

  @ManyToOne(() => User, user => user.gradings)
  grader: User

  @ManyToMany(() => Pet, pet => pet.ratings)
  pet: Pet[]

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date
}
