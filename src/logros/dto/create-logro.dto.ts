import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateLogroDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    codigo?: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    nombre: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    descripcion: string;
}
