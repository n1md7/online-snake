import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  private readonly startTimestamp = Date.now();

  @Get()
  public getHealth() {
    return {
      uptime: Date.now() - this.startTimestamp,
      status: 'alive',
    };
  }
}
