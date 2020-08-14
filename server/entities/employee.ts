import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from '.'

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  companyId: string

  @ManyToOne(type => Company)
  company: Company

  @Column({
    type: 'integer',
    nullable: true
  })
  age?: number
}
