import Player from '/src/player/player';
import SocketClient from '/src/client/socket/socket.client';
import { Socket } from 'socket.io-client';
import EventEmitter from 'eventemitter2';
import { userStore } from '/src/store/user.store';
import { url } from '/src/utils/url.utils';
import Board from '/src/board/board';
import { MathUtils } from '/src/utils/Math.utils';

export default class GameService extends EventEmitter {
  private readonly _ended: boolean;
  private readonly _socketNamespace: SocketClient;
  private readonly _socketClient: Socket;
  private readonly _players: Player[] = [];

  constructor(private readonly _board: Board) {
    super();
    this._ended = false;
    this._socketNamespace = new SocketClient();
    this._socketClient = this._socketNamespace.game;
  }

  // TODO create socket connection

  get ended() {
    return this._ended;
  }

  get players() {
    return this._players;
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Disable default page scrolling on Space key press
    if (e.target === document.body) e.preventDefault();

    // The first index entry is current player
    const player = this._players[0];
    if (!player) return;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) player.goLeft();
    if (['ArrowUp', 'KeyW'].includes(e.code)) player.goUp();
    if (['ArrowRight', 'KeyD'].includes(e.code)) player.goRight();
    if (['ArrowDown', 'KeyS'].includes(e.code)) player.goDown();
    if (['Space'].includes(e.code)) player.increaseSpeed();
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (['Space'].includes(e.code)) this._players[0]?.decreaseSpeed();
  }

  subscribe() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    this._socketNamespace.open((err) => {
      if (err) return console.error(err.message);
    });
    this._socketClient.on('error', (data) => {
      console.log(data);
      this.emit('server:error', data);
    });
    this._socketClient.on('connect', () => {
      console.log('Socket connected successfully');
      this.emit('connected');
    });

    this._socketClient.on('game:created', (gameId: string) => {
      userStore.setValue({ gameId });
      this.joinGame(gameId);
    });

    this._socketClient.on('game:started', (data) => {
      console.log('Freaking Game started', data);
      const permutationValue = MathUtils.getRandomInt(0, 30) * this._board.cols;
      const permutedPoints = [0, 1, 2, 3, 4, 5, 6].map((a) => a + permutationValue);
      const player = new Player(this._board).addInitialBlocks(permutedPoints);
      player.setSocket(this._socketClient);
      player.setUuid(data.userId);
      this._players.push(player);
    });

    this._socketClient.on('player:joined', ({ userId }: { userId: string }) => {
      console.log('Player joined', userId);
      const player = new Player(this._board, 'blue').addInitialBlocks([300, 301, 302]);
      player.setUuid(userId);
      player.setSocket(this._socketClient);
      player.setName('Jora');
      player.setUuid(userId);
      this._players.push(player);
    });

    this._socketClient.on('player:positions', (uuid: string, blocks: number[]) => {
      const player = this._players.find((p) => p.uuid === uuid);
      if (player && !player.blocksMatch(blocks)) {
        player.overrideBlocks(blocks);
      }
    });
  }

  unsubscribe() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }

  createGame() {
    const { uuid: userId, name } = userStore.getValue();
    this._socketClient.emit('create', { userId, name });
  }

  joinGame(gameId: string) {
    const { uuid: userId } = userStore.getValue();
    this._socketClient.emit('join', { userId, gameId });
    url.setGameID(gameId);
  }
}
