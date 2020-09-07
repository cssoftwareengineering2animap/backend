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

  @ManyToOne(() => User, user => user.pets)
  owner: User

  @ManyToMany(() => File)
  @JoinTable()
  pictures: File[]
  // passeios[Relação]
  // dono[Relação]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
