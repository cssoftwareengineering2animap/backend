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
  nome: string

  @Column()
  email: string

  @Column()
  phone: string

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
