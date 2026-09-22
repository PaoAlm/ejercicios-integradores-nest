import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Estudiante } from "../../estudiantes/entities/estudiante.entity";
import { Curso } from "../../cursos/entities/curso.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Unique(['estudiante', 'curso'])
export class Inscripcion {

  @ApiProperty ({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'Inscripcion ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estudiante, { eager: true, nullable: false })
  estudiante: Estudiante;

  @ManyToOne(() => Curso, { eager: true, nullable: false, onDelete: 'CASCADE' })
  curso: Curso;

  @ApiProperty({
    example: 45,
    description: 'Progreso del curso del 1 al 100',
  })
  @Column('float', { default: 0 })
  progreso: number;

  @ApiProperty({
    example: 'en_progreso',
    description: 'Progreso del curso',
  })
  @Column('text', { default: 'en_progreso' })
  estado: 'en_progreso' | 'completado';

  @ApiProperty({
    example: '2023-02-10 03:00:00',
    description: 'Fecha de inscripción al curso',
  })
  @CreateDateColumn()
  fechaInscripcion: Date;

  @ApiProperty({
    example: '2023-04-15 05:20:00',
    description: 'Fecha al completar el curso',
  })
  @Column('timestamp', { nullable: true })
  fechaCompletado: Date | null;
}