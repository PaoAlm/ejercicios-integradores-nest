import { Inscripcion } from "src/inscripciones/entities/inscripcion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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