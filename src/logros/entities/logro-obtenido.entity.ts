import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Logro } from "./logro.entity";

@Entity()
export class LogroObtenido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estudiante, { eager: true })
  estudiante: Estudiante;

  @ManyToOne(() => Logro, { eager: true })
  logro: Logro;

  @CreateDateColumn()
  fechaObtenido: Date;
}