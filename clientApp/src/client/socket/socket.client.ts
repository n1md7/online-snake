import { EnvUtil } from '/src/utils/env.util';

import { Manager, Socket } from 'socket.io-client';
import { userStore } from '/src/store/user.store';

export default class SocketClient extends Manager {
  private readonly _game: Socket;

  constructor() {
    super(EnvUtil.URL(), {
      transports: ['websocket'],
      onlyBinaryUpgrades: true,
    });
    this._game = this.socket('/game', {
      auth: {
        userId: userStore.getValue().uuid,
      },
    });
  }

  get game() {
    return this._game;
  }
}
