import { Inscripcion } from "src/inscripciones/entities/inscripcion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CursoImage } from "./curso-image.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Curso {

  @ApiProperty({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'Curso ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Nest desde cero',
    description: 'Título del curso',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  titulo: string;

  @ApiProperty({
    example: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
    description: 'Descripción del curso'
  })
  @Column('text')
  descripcion: string;

  @ApiProperty({
    example: ['programacion', 'diseno', 'negocios', 'datos'],
    description: 'Categoria del curso'
  })
  @Column('text')
  categoria: string;

  @ApiProperty({
    example: 25,
    description: 'Duracion del curso',
    default: 0
  })
  @Column('float')
  duracionHoras: number;

  @ApiProperty({
    example: true,
    description: 'Estatus del curso'
  })
  @ApiProperty()
  @Column('bool', { default: true })
  activo: boolean;

  @OneToMany(
        () => CursoImage,
        (cursoImage) => cursoImage.curso,
        { cascade: true, eager: true }
    )
    images?: CursoImage[];
}