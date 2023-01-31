import { HttpException, Injectable } from '@nestjs/common';
import { UserStoreService } from '../store/user-store/user-store.service';
import { StoreKey } from '../store/abstract.store';
import { User } from '../../game/entities/users/user';

@Injectable()
export class UsersService {
  constructor(private readonly store: UserStoreService) {}

  async signUp(key: StoreKey, name: string): Promise<StoreKey> {
    const value = await this.store.fetchFromRedis(key);
    if (value) throw new HttpException('Key already used', 400);

    await this.store.insertToRedis(key, User.from({ id: key, name }));

    return key;
  }

  async signIn(key: string): Promise<User> {
    const value = await this.store.fetchFromRedis(key);
    if (value) return value;

    throw new HttpException('User by Key not found', 404);
  }

  async details(key: string): Promise<User | undefined> {
    return this.store.fetchFromRedis(key);
  }
}
