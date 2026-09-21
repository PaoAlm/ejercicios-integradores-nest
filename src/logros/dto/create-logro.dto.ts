import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateLogroDto {

    @IsString()
    @IsOptional()
    codigo?: string;

    @IsString()
    @MinLength(3)
    nombre: string;

    @IsString()
    @MinLength(3)
    descripcion: string;
}
