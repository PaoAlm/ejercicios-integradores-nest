import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Estudiante } from "../../estudiantes/entities/estudiante.entity";
import { Curso } from "../../cursos/entities/curso.entity";

@Entity()
@Unique(['estudiante', 'curso'])
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estudiante, { eager: true, nullable: false })
  estudiante: Estudiante;

  @ManyToOne(() => Curso, { eager: true, nullable: false, onDelete: 'CASCADE' })
  curso: Curso;

  @Column('float', { default: 0 })
  progreso: number;

  @Column('text', { default: 'en_progreso' })
  estado: 'en_progreso' | 'completado';

  @CreateDateColumn()
  fechaInscripcion: Date;

  @Column('timestamp', { nullable: true })
  fechaCompletado: Date | null;
}