import { Global, Module, Scope } from '@nestjs/common';
import { RequestService } from './request.service';
import { REQUEST } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: RequestService,
      useFactory: (request) => new RequestService(request),
      inject: [REQUEST],
      scope: Scope.REQUEST,
    },
  ],
  exports: [RequestService],
})
export class RequestModule {}
