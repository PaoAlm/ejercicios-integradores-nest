import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from './decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

