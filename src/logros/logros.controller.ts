import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { UpdateLogroDto } from './dto/update-logro.dto';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { GetUser } from 'src/auth/decorators';
import { CreateLogroObtenidoDto } from './dto/create-logro-obtenido.dto';

@Controller('logros')
export class LogrosController {
  constructor(private readonly logrosService: LogrosService) {}

  @Post()
  create(
    @Body() createLogroDto: CreateLogroDto,
    @GetUser() user: Estudiante
  ) {
    return this.logrosService.create(createLogroDto, user);
  }

}
