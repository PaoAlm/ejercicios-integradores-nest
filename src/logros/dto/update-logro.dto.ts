import { PartialType } from '@nestjs/swagger';
import { CreateLogroDto } from './create-logro.dto';

export class UpdateLogroDto extends PartialType(CreateLogroDto) {}
