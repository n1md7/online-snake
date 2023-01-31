import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { SetupModule } from '../../common/setup/setup.module';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return defined value', () => {
    expect(controller.getHealth()).toEqual(
      expect.objectContaining({
        status: 'alive',
        uptime: expect.any(Number),
      }),
    );
  });
});
