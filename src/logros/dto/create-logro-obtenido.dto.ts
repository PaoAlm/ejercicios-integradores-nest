import { IsDate, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { Logro } from "../entities/logro.entity";

export class CreateLogroObtenidoDto {

    @IsUUID()
    estudianteId: string;

    @IsString()
    logroId: string;
    
    @IsOptional()
    @IsDate()
    fechaObtenido?: Date;
}
