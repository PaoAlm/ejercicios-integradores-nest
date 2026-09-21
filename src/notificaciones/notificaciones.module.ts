import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesGateway } from './notificaciones.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificacionesGateway, NotificacionesService],
  imports: [AuthModule],
  exports: [NotificacionesGateway]
})
export class NotificacionesModule {}
