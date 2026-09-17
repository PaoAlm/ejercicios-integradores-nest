import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { LoginUserDto } from 'src/common/dtos/login.dto';
import { Estudiante } from './entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post()
    create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.estudiantesService.login(loginUserDto);
  }


  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: Estudiante
  ){
    return this.estudiantesService.checkAuthStatus( user );
  }

  @Get()
  @Auth()
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto
  ) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
}
