import { plainToInstance, Type } from 'class-transformer';

export class Spectator {
  @Type(() => String) private _id: string;
  get id() {
    return this._id;
  }

  @Type(() => String) private _name: string;
  get name() {
    return this._name;
  }

  @Type(() => String) private _socketId: string;
  get socketId() {
    return this._socketId;
  }

  static from(payload: Partial<Spectator> | unknown) {
    return plainToInstance(Spectator, payload);
  }
}
