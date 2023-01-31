import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from '../setup/logger';
import { RequestService } from '../setup/request';
import { LoggerUtils } from '../setup/logger';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestService = new RequestService(request);
    const logger = new LoggerService(requestService);

    return next.handle().pipe(
      catchError((error) => {
        logger.error(
          LoggerUtils.stringify({
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
            ...(error.isAxiosError && {
              response: {
                data: error.response?.data,
                message: error.response?.message,
              },
            }),
          }),
          'ExceptionInterceptor',
        );

        switch (true) {
          case error instanceof HttpException:
            throw error;
          case error.name === 'EntityNotFoundError':
            throw new NotFoundException(error.message);
          case error.isAxiosError:
            const errorMessage = error.response?.data || error.message;
            throw new UnprocessableEntityException(errorMessage);
          default:
            throw new InternalServerErrorException();
        }
      }),
    );
  }
}
