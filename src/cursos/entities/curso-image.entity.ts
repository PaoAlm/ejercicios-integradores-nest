import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Curso } from "../entities/curso.entity";


@Entity({ name: 'curso_images' })
export class CursoImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Curso,
        (curso) => curso.images,
        { onDelete: 'CASCADE' } 
    )
    curso: Curso;

}