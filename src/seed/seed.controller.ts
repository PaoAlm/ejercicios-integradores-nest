import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth()
  @ApiResponse({ status: 201, description: 'Seed ejecutada'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  executeSeed() {
    return this.seedService.runSeed();
  }

}
