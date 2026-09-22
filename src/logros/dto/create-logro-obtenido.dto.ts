import { IsDate, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { Logro } from "../entities/logro.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLogroObtenidoDto {

    @ApiProperty()
    @IsUUID()
    estudianteId: string;

    @ApiProperty()
    @IsString()
    logroId: string;
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    fechaObtenido?: Date;
}
