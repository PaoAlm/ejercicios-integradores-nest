import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Logro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  codigo: string;

  @Column('text', { unique: true })
  nombre: string;

  @Column('text')
  descripcion: string;

  @BeforeInsert()
    checkCodigoInsert( ) {
      if ( !this.codigo ) {
        this.codigo = this.nombre;
      }

      this.codigo = this.codigo
        .toUpperCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }

  @BeforeUpdate()
    checkCodigoUpdate( ) { 
      this.codigo = this.codigo
        .toUpperCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }
}
