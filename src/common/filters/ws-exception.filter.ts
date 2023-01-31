import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { RequestService } from '../setup/request';
import { LoggerService } from '../setup/logger';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);

    const ctx = host.switchToWs();
    const socket = ctx.getClient();
    const requestService = { getRequestId: () => socket.id } as RequestService;
    const logger = new LoggerService(requestService);
    logger.error(exception);
    socket.emit('error', exception);
  }
}
