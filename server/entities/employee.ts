import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from './company'

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ type: 'integer', nullable: true })
  age?: number

  @Column({ nullable: true })
  companyId?: string

  @ManyToOne(type => Company, { nullable: true })
  company?: Company
}
