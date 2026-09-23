import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from './decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login.dto';
import { CreateEstudianteDto } from 'src/estudiantes/dto/create-estudiante.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Estudiante creado', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  register(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.authService.register(createEstudianteDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Sesión iniciada.', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({ status: 201, description: 'Nuevo JWT Token'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  checkAuthStatus(
    @GetUser() user: Estudiante
  ){
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @ApiBearerAuth('JWT-auth')
  @Auth()
  @ApiResponse({ status: 201, description: 'Info del usuario', type: Estudiante})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  privateRoute(
    @GetUser() user: Estudiante
  ){
    return {
      ok: true,
      user
    }
  }

}

