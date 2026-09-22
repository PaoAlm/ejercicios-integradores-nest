import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Logro {

  @ApiProperty ({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'Logro ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'PRIMEROS_PASOS',
    description: 'Código del curso',
    uniqueItems: true
  })
  @Column('text', { unique: true })
  codigo: string;

  @ApiProperty({
    example: 'Primeros Pasos',
    description: 'Nombre del logro'
  })
  @Column('text', { unique: true })
  nombre: string;

  @ApiProperty({
    example: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
    description: 'Descripción del logro'
  })
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
