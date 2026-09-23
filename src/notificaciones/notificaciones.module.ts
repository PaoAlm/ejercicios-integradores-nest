import { forwardRef, Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesGateway } from './notificaciones.gateway';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';

@Module({
  providers: [NotificacionesGateway, NotificacionesService],
  imports: [
    forwardRef(() => EstudiantesModule)
  ],
  exports: [NotificacionesGateway]
})
export class NotificacionesModule {}
