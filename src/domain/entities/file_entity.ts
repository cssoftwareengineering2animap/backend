import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import { ID } from "../../core/types/id"

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  key: string

  @Column()
  url: string
}
