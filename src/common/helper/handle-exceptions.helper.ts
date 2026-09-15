import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export class HandleDbExceptions {
  public static handle(error: any, context: string = 'DBHelper') {
    const logger = new Logger(context);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}