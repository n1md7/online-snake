import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from '/src/common/filters/ws-exception.filter';
import { SignInRequest } from './requests/sign-in.request';
import { TokenService } from '../token/token.service';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  namespace: 'users',
  cors: { origin: '*' },
})
export class UsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly token: TokenService) {}

  afterInit() {
    Logger.log('Socket initialized', 'UsersGateway');
  }

  handleConnection(@ConnectedSocket() client: Socket): void {
    try {
      this.token.verify(client.handshake.auth.token);
      Logger.log(`connected`, client.id);
    } catch (e) {
      // Only SubscribeMessage is filtered by exception filter
      client.emit('error', {
        code: 'UNAUTHORIZED',
        message: 'You are unauthorized',
      });
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    Logger.log(`disconnected`, client.id);
  }

  @SubscribeMessage('token:get')
  getToken(): string {
    return this.token.sign({ userId: '1' });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return 'Hello world!' + data;
  }

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @SubscribeMessage('validate')
  validate(@MessageBody() data: SignInRequest, @ConnectedSocket() client: Socket) {
    return data;
  }

  @SubscribeMessage('give:error')
  giveMeSomeError(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    throw new WsException({
      name: 'ERR_SOME',
      message: 'You are a dumb ass',
      status: 400,
    });
  }
}
