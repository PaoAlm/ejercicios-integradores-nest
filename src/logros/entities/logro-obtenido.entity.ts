import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Logro } from "./logro.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class LogroObtenido {

  @ApiProperty ({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'Inscripcion ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estudiante, { eager: true })
  estudiante: Estudiante;

  @ManyToOne(() => Logro, { eager: true })
  logro: Logro;

  @ApiProperty({
    example: '2023-02-10 03:00:00',
    description: 'Fecha en la que se obtuvo el logro',
  })
  @CreateDateColumn()
  fechaObtenido: Date;
}