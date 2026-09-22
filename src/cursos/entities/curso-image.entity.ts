import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Curso } from "../entities/curso.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name: 'curso_images' })
export class CursoImage {

    @ApiProperty({
        example: '2',
        description: 'Imagen ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'http://localhost:3000/api/files/curso/eb8ee1f3-af0a-4a30-8adc-c019282296c5.png',
        description: 'Imagen del curso'
    })
    @Column('text')
    url: string;

    @ManyToOne(
        () => Curso,
        (curso) => curso.images,
        { onDelete: 'CASCADE' } 
    )
    curso: Curso;

}