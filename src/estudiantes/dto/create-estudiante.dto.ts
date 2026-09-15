import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateEstudianteDto {
    @IsString()
    @MinLength(5)
    nombreCompleto: string;

    @IsEmail()
    email: string;
}
