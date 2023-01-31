import { plainToInstance } from 'class-transformer';

export class User {
  constructor(readonly id: string, readonly name: string) {}

  static from(payload: User) {
    return plainToInstance(User, payload);
  }
}
