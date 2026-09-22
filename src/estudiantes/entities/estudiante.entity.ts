import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Estudiante {

  @ApiProperty ({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'User ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Ana García',
    description: 'Nombre completo del estudiante'
  })
  @Column('text')
  nombreCompleto: string;

  @ApiProperty({
    example: 'name@example.com',
    description: 'Email del estudiante',
    uniqueItems: true
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: '********',
    description: 'Contraseña del usuario'
  })
  @Column('text', {
    select: false
  })
  password: string;

  @ApiProperty({
    example: ['admin', 'estudiante'],
    description: 'Roles del usuario'
  })
  @Column('text', {
    array: true,
    default: ['estudiante']
  })
  roles: string[];

  @ApiProperty({
    example: true,
    description: 'Estatus del usuario'
  })
  @Column('bool', {
    default: true
  })
  isActive: boolean;
}