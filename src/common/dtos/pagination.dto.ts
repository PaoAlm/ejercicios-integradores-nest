import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { CategoriasValidas } from "src/cursos/interfaces/categorias";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;

    @IsOptional()
    @IsString({ each: true })
    @IsIn(CategoriasValidas, { each: true })
    @Transform(({ value }) => {
        if (value === undefined) return value; 
        return Array.isArray(value) ? value : [value];
    })
    categoria: string[];
}