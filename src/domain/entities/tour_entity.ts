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
import { Host } from "./host_entity"
import { Pet } from "./pet_entity"

export enum TourStatus {
  pending = "pending",
  denied = "denied",
  accepted = "accepted",
  completed = "completed",
}

@Entity()
export class Tour extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  scheduledFor: Date

  @Column()
  tip: string

  @Column()
  petId: ID

  @ManyToOne(() => Pet, pet => pet.tours)
  pet: Pet

  @ManyToOne(() => Host, host => host.tours)
  host: Host

  @Column()
  status: TourStatus

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date
}
