import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombreCompleto: string;

  @Column('text', { unique: true })
  email: string;
}