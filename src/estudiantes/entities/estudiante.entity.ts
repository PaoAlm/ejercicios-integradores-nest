import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombreCompleto: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', {
    select: false
  })
  password: string;

  @Column('text', {
    array: true,
    default: ['estudiante']
  })
  roles: string[];

  @Column('bool', {
    default: true
  })
  isActive: boolean;
}