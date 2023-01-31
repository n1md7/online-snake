import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { SetupModule } from '../../common/setup/setup.module';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule],
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign', () => {
    expect(service.sign({ claim: '01' })).toEqual(expect.any(String));
  });

  it('should verify', () => {
    const token = service.sign({ claim: '01' });
    expect(() => service.verify(token)).not.toThrow();
  });

  it('should decode', () => {
    const token = service.sign({ claim: '01' });
    expect(service.decode(token)).toEqual(
      expect.objectContaining({ claim: '01' }),
    );
  });
});
