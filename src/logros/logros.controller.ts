import { Controller, Post, Body, Get } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logro } from './entities/logro.entity';

@ApiTags('Logros')
@Controller('logros')
export class LogrosController {
  constructor(private readonly logrosService: LogrosService) {}

  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: 'Nuevo Logro creado', type: Logro})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  create(
    @Body() createLogroDto: CreateLogroDto,
    @GetUser() user: Estudiante
  ) {
    return this.logrosService.create(createLogroDto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Listado de logros', type: Logro})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findAll() {
    return this.logrosService.findAll();
  }

}
