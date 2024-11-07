import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from './ws-exception.filter';
import { AuthSocket, WSAuthMiddleware } from './ws-auth.middleware';
import { NotificationMessageDTO } from '../../dto/notification-message.dto';

@WebSocketGateway(parseInt(process.env.SOCKET_PORT || '3001', 10), {
  cors: {
    origin: process.env.UI_HOST,
    methods: ['GET', 'POST']
  }
})
@UseFilters(new WsExceptionFilter())
export class EventsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);
  private readonly notificationChannel = process.env.NOTIFICATION_CHANEL || '';
  @WebSocketServer() server: Server;

  private userConnections: Map<Socket, string> = new Map();
  private redisSub: Redis;

  constructor(private readonly jwtService: JwtService) {
    this.redisSub = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10)
    });

    this.redisSub
      .subscribe(this.notificationChannel, (err) => {
        if (err) {
          this.logger.error(`Can't subscribe to redis chanel ${this.notificationChannel}: `, err);
        }
      })
      .then();

    this.redisSub.on('message', (channel, text) => {
      if (channel === this.notificationChannel) {
        this.processNotification(text);
      }
    });
  }

  private processNotification(text: string) {
    try {
      this.sendMessageToUser(JSON.parse(text));
    } catch (error: any) {
      this.logger.error('Error in processing message: ', error.message);
    }
  }

  afterInit(server: Server) {
    const middle = WSAuthMiddleware(this.jwtService);
    server.use(middle);
    this.logger.log(`Sockets initialized`);
  }

  handleConnection(client: AuthSocket) {
    this.userConnections.set(client, client.userId);
    this.logger.log(`User connected. UserId: ${client.userId}`);
  }

  handleDisconnect(client: AuthSocket) {
    this.userConnections.delete(client);
    this.logger.log(`User disconnected. UserId: ${client.userId}`);
  }

  private sendMessageToUser({ receiver, message, messageType, sender }: NotificationMessageDTO) {
    for (const [client, id] of this.userConnections.entries()) {
      if (id === receiver && client.connected) {
        client.send({ sender, messageType, message });
      }
    }
  }
}
