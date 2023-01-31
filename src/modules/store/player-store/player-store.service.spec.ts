import { Test, TestingModule } from '@nestjs/testing';
import { PlayerStoreService } from './player-store.service';

describe('PlayerStoreService', () => {
  let service: PlayerStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerStoreService],
    }).compile();

    service = module.get<PlayerStoreService>(PlayerStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
