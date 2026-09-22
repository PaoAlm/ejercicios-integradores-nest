import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { CategoriasValidas } from "src/cursos/interfaces/categorias";

export class PaginationDto {
    @ApiProperty({
        default: 10, description: 'Cantidad de registros mostrados'
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit?: number;

    @ApiProperty({
        default: 2, description: 'Cantidad de registros a omitir'
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;

    @ApiProperty({
        default: 'Diseno', description: 'Categorias de los cursos que se quieren visualizar'
    })
    @IsOptional()
    @IsString({ each: true })
    @IsIn(CategoriasValidas, { each: true })
    @Transform(({ value }) => {
        if (value === undefined) return value; 
        return Array.isArray(value) ? value : [value];
    })
    categoria: string[];
}