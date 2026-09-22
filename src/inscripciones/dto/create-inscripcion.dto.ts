import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInscripcionDto {

    @ApiProperty()
    @IsUUID ()
    estudianteId: string;

    @ApiProperty()
    @IsUUID ()
    cursoId: string;

    @ApiProperty()
    @IsOptional ()
    progreso?: number;

    @ApiProperty()
    @IsOptional()
    @IsIn(['en_progreso', 'completado'], {
        message: 'El estado debe ser: en_progreso o completado'
    })
    estado?: 'en_progreso' | 'completado';
}
