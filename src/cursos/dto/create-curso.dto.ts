import { IsIn, IsInt, IsOptional, IsPositive, IsString, IsUrl, MinLength } from "class-validator";
import { CategoriasValidas } from "../interfaces/categorias";

export class CreateCursoDto {

    @IsString()
    @MinLength(3)
    titulo: string;

    @IsString()
    @MinLength(3)
    descripcion: string;

    @IsString()
    @IsIn(CategoriasValidas)
    categoria: string;

    @IsInt()
    @IsPositive()
    duracionHoras: number;

    @IsUrl({ require_tld: false }, { each: true })
    @IsOptional()
    images?: string[]
}