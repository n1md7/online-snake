import * as PIXI from 'pixi.js';
import { Grid } from '../components/Grid.js';
import { Block } from '../components/Block.js';
import { Socket, io } from 'socket.io-client';
import { EnvUtil } from '../env.util.js';
import { Player } from '../player/Player.js';
import { Speed } from '../player/components/Speed.js';
import { Point } from '../player/components/Point.js';

export class Game {
  private readonly app: PIXI.Application;
  private readonly FPS: number;
  private readonly grid: Grid;
  private readonly players: Player[] = [];

  private gameIO!: Socket;

  constructor(private readonly width: number, private readonly height: number) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0xeeeeee,
      resolution: window.devicePixelRatio || 1,
    });
    this.FPS = 60;
    this.grid = new Grid(this.app);
  }

  getPlayer() {
    return this.players?.at(0);
  }

  /**
   * One time update to set up game
   * @private
   */
  private setup() {
    console.log('One time update. Setup');
    this.grid.setRow(this.height / Block.SIZE);
    this.grid.setCol(this.width / Block.SIZE);
    this.grid.build();
  }

  /**
   * Update loop with high FPS but intended for UI renders
   * @private
   */
  private normalUpdates() {
    // console.log('Normal');
  }

  /**
   * Update loop for calculations has higher priority than regular one
   * @private
   */
  private intenseUpdates() {
    const now = Date.now();
    for (const player of this.players) {
      if (player.canMove() && player.needsUpdate(now)) {
        this.handlePlayerSpeed(player);
        this.handlePlayerRender(player);
      }
    }
    // console.log('Intense');
  }

  private render(): void {
    const canvas = document.querySelector('#canvas');
    if (canvas) canvas.appendChild(<HTMLCanvasElement>this.app.view);
  }

  private subscribeEvents(userId: string) {
    this.gameIO.on('connect', async () => {
      console.log('Socket connected', this.gameIO.connected);
      const { gameId } = await this.gameIO.emitWithAck('create', { userId, name: 'Hello' });
      await this.gameIO.emitWithAck('join', { userId, gameId });
    });
  }

  handlePlayerRender(player: Player) {
    player.removeTail();
    for (const block of player) block?.updateAsBody();
    player.appendHead();
  }

  private handlePlayerSpeed(player: Player) {
    if (player.accelerateRequested) {
      return player.speed.increase();
    }
    player.speed.decrease();
  }

  private createPlayer() {
    const speed = new Speed(500, 100);
    const point = new Point();
    const player = new Player(
      [0, 1, 2, 3].map((a) => a),
      this.grid,
      speed,
      point,
      'red',
      'Player',
    );
    this.players.push(player);

    this.players.push(
      new Player(
        [0, 1, 2, 3].map((a) => a + 160),
        this.grid,
        new Speed(500, 100),
        new Point(),
        'red',
        'Player',
      ),
    );
  }

  start(userId: string) {
    console.log('Game started');
    this.gameIO = io(EnvUtil.URL + '/game', {
      auth: {
        userId,
      },
    });
    this.subscribeEvents(userId);
    this.render();
    this.createPlayer();
    this.app.ticker.addOnce(this.setup, this, PIXI.UPDATE_PRIORITY.HIGH);
    this.app.ticker.add(this.normalUpdates, this, PIXI.UPDATE_PRIORITY.NORMAL);
    this.app.ticker.add(this.intenseUpdates, this, PIXI.UPDATE_PRIORITY.HIGH);
  }
}
