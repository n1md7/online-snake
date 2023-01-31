import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SetupModule } from '../../common/setup/setup.module';
import { StoreModule } from '../store/store.module';
import { User } from '../../game/entities/users/user';
import { UserStoreService } from '../store/user-store/user-store.service';

describe('UsersService', () => {
  let service: UsersService;
  let store: UserStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, StoreModule],
      providers: [UsersService],
    }).compile();

    await module.init();
    service = module.get<UsersService>(UsersService);
    store = module.get<UserStoreService>(UserStoreService);
  });

  afterEach(() => {
    store.clear();
    return store.removeAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should verify signUp method', async () => {
      const key = 'key';
      const name = 'Jake';
      await expect(service.signUp(key, name)).resolves.toBe(key);
    });

    it('should throw when key already exists', async () => {
      const key = 'key';
      const name = 'Jake';
      await service.signUp(key, name);
      return expect(service.signUp(key, name)).rejects.toMatchSnapshot(
        'Key already used',
      );
    });
  });

  describe('signIp', () => {
    it('should verify signIp method', async () => {
      const key = 'key';
      const name = 'Jake';
      await service.signUp(key, name);
      await expect(service.signIn(key)).resolves.toBeInstanceOf(User);
    });

    it('should throw when key does not exist', () => {
      return expect(() => service.signIn('key')).toThrowErrorMatchingSnapshot(
        'Key not found',
      );
    });
  });

  describe('details', () => {
    it('should verify userDetails method', async () => {
      const key = 'key';
      const name = 'Jake';
      await service.signUp(key, name);
      await expect(service.details(key)).resolves.toBeInstanceOf(User);
      await expect(service.details('wrong-key')).resolves.toBeUndefined();
    });
  });
});
