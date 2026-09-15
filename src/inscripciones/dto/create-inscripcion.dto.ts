import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInscripcionDto {
    @IsUUID ()
    estudianteId: string;

    @IsUUID ()
    cursoId: string;

    @IsOptional ()
    progreso?: number;

    @IsOptional()
    @IsIn(['en_progreso', 'completado'], {
        message: 'El estado debe ser: en_progreso o completado'
    })
    estado?: 'en_progreso' | 'completado';
}
