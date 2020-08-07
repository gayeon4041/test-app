import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({
    type: 'integer',
    nullable: true
  })
  age?: number
}
