import { IsIn, IsInt, IsOptional, IsPositive, IsString, IsUrl, MinLength } from "class-validator";
import { CategoriasValidas } from "../interfaces/categorias";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCursoDto {

    @ApiProperty()
    @IsString()
    @MinLength(3)
    titulo: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    descripcion: string;

    @ApiProperty()
    @IsString()
    @IsIn(CategoriasValidas)
    categoria: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    duracionHoras: number;
}