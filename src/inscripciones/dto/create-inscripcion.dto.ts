import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateInscripcionDto {

    @ApiProperty()
    @IsUUID ()
    estudianteId: string;

    @ApiProperty()
    @IsUUID ()
    cursoId: string;

    @ApiProperty()
    @IsOptional ()
    @Min(0)
    @Max(100)
    progreso?: number;

    @ApiProperty()
    @IsOptional()
    @IsIn(['en_progreso', 'completado'], {
        message: 'El estado debe ser: en_progreso o completado'
    })
    estado?: 'en_progreso' | 'completado';
}
