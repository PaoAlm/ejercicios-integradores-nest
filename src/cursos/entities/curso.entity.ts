import { Inscripcion } from "src/inscripciones/entities/inscripcion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CursoImage } from "./curso-image.entity";

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

  @OneToMany(
        () => CursoImage,
        (cursoImage) => cursoImage.curso,
        { cascade: true, eager: true }
    )
    images?: CursoImage[];
}