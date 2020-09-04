import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
} from "typeorm"
import { ID } from "../../core/types/id"
import { File } from "./file_entity"

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

  @Column({ select: false })
  password: string

  @OneToOne(() => File)
  profilePicture: File

  //  pets[Relação]
  // fotos
  // tipo
  // ratings
  // documentos[Se for anfitrião]
  // bank_account[Se for anfitrião]
  // passeios[Se for anfitrião]
}
