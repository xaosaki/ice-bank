import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  userId: string;
}
export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;
export const WSAuthMiddleware = (jwtService: JwtService): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token
        ? socket.handshake.auth.token
        : socket.handshake.headers.token;

      if (!token) {
        throw new Error('Unauthorized');
      }

      const jwtPayload = jwtService.verify(token);
      if (jwtPayload) {
        socket.userId = jwtPayload.sub;
        next();
      } else {
        throw new Error('Unauthorized');
      }
    } catch (_) {
      next({
        name: 'Unauthorized',
        message: 'Unauthorized'
      });
    }
  };
};
