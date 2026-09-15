import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column('text')
  categoria: string;

  @Column('float')
  duracionHoras: number;

  @Column('bool', { default: true })
  activo: boolean;
}