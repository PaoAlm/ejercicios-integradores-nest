import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { UpdateLogroDto } from './dto/update-logro.dto';

@Controller('logros')
export class LogrosController {
  constructor(private readonly logrosService: LogrosService) {}

  @Post()
  create(@Body() createLogroDto: CreateLogroDto) {
    return this.logrosService.create(createLogroDto);
  }

  @Get()
  findAll() {
    return this.logrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logrosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogroDto: UpdateLogroDto) {
    return this.logrosService.update(+id, updateLogroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logrosService.remove(+id);
  }
}
