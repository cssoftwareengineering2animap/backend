/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { ID } from "../../core/types/id"
import { Host } from "./host_entity"

@Entity()
export class BankAccount extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  bank: string

  @Column()
  agency: string

  @Column()
  account: string

  @OneToOne(() => Host, host => host.bankAccount)
  @JoinColumn()
  owner: Host

  @CreateDateColumn({ name: "createdAt" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  public updatedAt: Date
}
