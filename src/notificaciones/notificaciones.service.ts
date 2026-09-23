import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        estudiante: Estudiante,
    };
}

@Injectable()
export class NotificacionesService {
    private connectedClients: ConnectedClients = {}

    constructor(
        private readonly estudiantesService: EstudiantesService
    ) {}

    async registerClient( client: Socket, estudianteId: string ) {
        let estudiante: Estudiante;
        
        try {
            estudiante = await this.estudiantesService.findOne(estudianteId);
        } catch {
            throw new Error('Estudiante no encontrado');
        }

        if ( !estudiante.isActive) throw new Error('Estudiante no activo');

        this.checkUserConnection( estudiante );

        this.connectedClients[client.id] = {
            socket: client,
            estudiante: estudiante,
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        console.log(this.connectedClients);
        return Object.keys( this.connectedClients );
    }

    getUserFullName(socketId: string){
        const clienteConectado = this.connectedClients[socketId];

        if (!clienteConectado || !clienteConectado.estudiante) {
          return 'Usuario Desconocido';
        }

        return clienteConectado.estudiante.nombreCompleto;
    }

    private checkUserConnection (estudiante: Estudiante) {

        for ( const clientId of Object.keys ( this.connectedClients ) ){
            const connectedClient = this.connectedClients[clientId];

            if( connectedClient.estudiante.id === estudiante.id ){
                connectedClient.socket.disconnect();
                break;
            }
        }

    }
    
}
