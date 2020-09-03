import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from "typeorm"
import { ID } from "../../core/types/id"

@Entity()
export class Pet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column()
  birthday: Date

  @Column()
  sex: string

  @Column()
  type: string

  @OneToOne(() => File)
  profilePicture: File

  @ManyToMany(() => File)
  @JoinTable()
  pictures: File[]
  // passeios[Relação]
  // dono[Relação]
  // VaccinationCard[relação]
}
