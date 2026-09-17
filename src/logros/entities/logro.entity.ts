import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Logro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  codigo: string; // ej. 'PRIMEROS_PASOS', 'EXPLORADOR', 'MARATONISTA'

  @Column('text')
  nombre: string;

  @Column('text')
  descripcion: string;
}