import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { NotificacionesService } from './notificaciones.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { JwtService } from 'node_modules/@nestjs/jwt/dist/jwt.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificacionesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly notificacionesService: NotificacionesService,
    private readonly JwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.JwtService.verify(token);
      await this.notificacionesService.registerClient( client, payload.id );
      client.join(payload.id);
      const nombreEstudiante = this.notificacionesService.getUserFullName(client.id);
      client.emit('nombre-estudiante', {
        estudiante: {
          nombreCompleto: nombreEstudiante 
        }
      });
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.notificacionesService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.notificacionesService.removeClient(client.id);
    this.wss.emit('clients-updated', this.notificacionesService.getConnectedClients());
  }


  emitirLogroDesbloqueado(estudianteId: string, logro: any) {
    this.wss.to(estudianteId).emit('logro-desbloqueado', {
      estudianteId,
      logro
    });
  }
  
}
