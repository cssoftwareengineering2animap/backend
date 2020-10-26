/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToOne,
} from "typeorm"
import { container } from "tsyringe"
import { ID } from "../../core/types/id"
import { File } from "./file_entity"
import {
  EncryptionProvider,
  EncryptionProviderToken,
} from "../providers/encryption_provider"
import { Rating } from "./rating_entity"
import { Blocking, } from "./blocking_entity"
import { BankAccount } from "./bank_account_entity"
import { Tour } from "./tour_entity"

const encryptionProvider = container.resolve<EncryptionProvider>(
  EncryptionProviderToken
)

@Entity()
export class Host extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: ID

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ select: false, nullable: false })
  password?: string

  @Column({ select: false })
  cpf: string

  @ManyToMany(() => File)
  @JoinTable()
  pictures: Promise<File[]>

  @ManyToMany(() => Rating, rating => rating.user)
  @JoinTable()
  ratings: Promise<Rating[]>

  @OneToMany(() => Rating, rating => rating.grader)
  gradings: Promise<Rating[]>

  @OneToMany(() => Blocking, blocking => blocking.host)
  blockings: Promise<Blocking[]>

  @OneToOne(() => BankAccount, account => account.owner)
  bankAccount: BankAccount

  @OneToMany(() => Tour, tour => tour.host)
  tours: Tour[]

  @CreateDateColumn({ name: "createdAt" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updatedAt" })
  public updatedAt: Date

  @BeforeUpdate()
  @BeforeInsert()
  public async hashPassword() {
    if (!this.password) {
      return
    }

    this.password = await encryptionProvider.hash(this.password)
  }
}
