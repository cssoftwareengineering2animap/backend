/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
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

  @ManyToOne(() => User, user => user.ratings)
  user: User

  @ManyToOne(() => Pet, pet => pet.ratings)
  pet: Pet

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
