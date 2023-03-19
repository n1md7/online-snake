import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import {
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from '/src/common/filters/ws-exception.filter';
import { Server, Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';
import { UsersService } from '../users/users.service';
import { CreateGameRequest } from './requests/create-game.request';
import { GameService } from './game.service';
import { JoinGameRequest } from './requests/join-game.request';
import { GameStoreService } from '../store/game-store/game-store.service';
import { Player } from '/src/game/entities/users/player';
import { Food } from '/src/game/entities/grid/food';
import { Grid } from '/src/game/entities/grid/grid';
import { DirectionType } from '/src/game/entities/users/direction';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  namespace: 'game',
  cors: { origin: '*' },
})
export class GameGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    OnModuleInit,
    OnApplicationShutdown
{
  @WebSocketServer()
  io: Server;

  private readonly logger = new Logger('GameGateway');
  private timerId: ReturnType<typeof setInterval>;

  constructor(
    private readonly userService: UsersService,
    private readonly playerService: PlayersService,
    private readonly gameService: GameService,
    private readonly gameStore: GameStoreService,
  ) {}

  afterInit() {
    this.logger.log('Socket initialized');
  }

  async onModuleInit() {
    this.logger.verbose('Gateway module initialized');
    this.timerId = setInterval(this.mainLoop.bind(this), 24);
  }

  onApplicationShutdown(signal?: string): any {
    clearInterval(this.timerId);
  }

  private async mainLoop() {
    try {
      const currentTick = Date.now();
      for (const game of this.gameStore.values()) {
        if (!game.isStarted) continue;

        if (game.needsEmit(currentTick)) {
          for (const player of game.players) {
            if (player.isActive() && player.needsUpdate(currentTick)) {
              if (!player.canMove(game.grid)) {
                this.io.to(game.id).emit('player:died', {
                  id: player.id,
                  status: player.getStatus(),
                });
              } else {
                this.handlePlayerSpeed(player);
                this.handlePlayerEatFood(
                  game.food,
                  game.grid,
                  game.players,
                  player,
                  (points, point) => {
                    this.io.to(game.id).emit('food:spawn', { points });
                    this.io.to(game.id).emit('food:devour', { point });
                  },
                );
                this.handlePlayerUpdate(player, game.grid);
              }

              this.io
                .in(game.id)
                .emit('player:positions', player.id, [...player.blockIndices()]);
            }
          }
        }
      }
    } catch (e) {
      console.trace(e);
    }
  }

  private handlePlayerSpeed(player: Player) {
    if (player.accelerateRequested) {
      return player.speed.increase();
    }
    player.speed.decrease();
  }

  private handlePlayerEatFood(
    food: Food,
    grid: Grid,
    players: Player[],
    player: Player,
    callback: (points: number[], eaten: number) => void,
  ) {
    if (food.ids.has(player.headId)) {
      food.ids.delete(player.headId);
      player.points.increase();
      player.addTailBlock();
      callback(food.generate(grid, players, 1), player.headId);
    }
  }

  handlePlayerUpdate(player: Player, grid: Grid) {
    player.removeTail(grid);
    player.appendHead(grid);
    for (const idx of player.blockIndices()) {
      const { row, col } = Grid.get2dIdx(idx);
      const block = grid.blocks[row][col];
      block.updateAsBody();
    }
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      this.logger.warn('USER_ID is null during the handshake', socket.id);
      return socket.emit('error', {
        code: 'UNAUTHORIZED',
        message: 'USER_ID is null during the handshake',
      });
    }

    this.logger.log(`User connected (${userId})`, socket.id);

    const user = await this.userService.details(userId);
    if (!user) {
      this.logger.warn(`USER_ID is invalid: (${userId})`, socket.id);
      return socket.emit('error', {
        code: 'UNAUTHORIZED',
        message: 'USER_ID is invalid',
      });
    }

    await this.playerService.create(user.id, user.name, socket.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.logger.log(`disconnected`, client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return 'Hello world!' + data;
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('create')
  async create(
    @MessageBody() payload: CreateGameRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    const gameId = this.gameService.generateId();
    this.logger.verbose(`Creating... New game (${payload.name}).`, socket.id);
    try {
      await this.gameService.create(gameId, payload.name, payload.userId);
      this.logger.verbose(`Game (${payload.name}:${gameId}) created.`, socket.id);
    } catch (error) {
      this.logger.error(error.message, socket.id);
      return { error: error.message };
    }

    const game = await this.gameService.get(gameId);
    game.isStarted = true; // Start by default

    socket.emit('game:created', gameId);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('join')
  async join(
    @MessageBody() { gameId, userId }: JoinGameRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.verbose(
      `User (${userId}) is joining. Game room (${gameId})...`,
      socket.id,
    );
    const game = await this.gameService.get(gameId);
    const player = await this.playerService.get(userId);
    if (!game) {
      throw new WsException({
        name: 'ERR_GAME_JOIN',
        message: `Game (${gameId}) not fount. Not able to join.`,
        status: 404,
      });
    }
    socket.join(gameId);
    game.addPlayer(player);
    await this.gameService.update(gameId, game);
    this.logger.verbose(`User joined. Game room (${gameId}).`, socket.id);

    // Sent only to joined client
    socket.emit('game:started', { rows: Grid.ROWS, cols: Grid.COLS, food: 2, userId });

    // Sent to everybody except the sender
    socket.to(gameId).emit('player:joined', { userId });
  }

  @SubscribeMessage('player:direction')
  async changeDirection(
    // FIXME: define strict type
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const player = await this.playerService.get(data.playerId);
      if (data.direction === 'Up') player.setDirection(DirectionType.Up);
      if (data.direction === 'Down') player.setDirection(DirectionType.Down);
      if (data.direction === 'Left') player.setDirection(DirectionType.Left);
      if (data.direction === 'Right') player.setDirection(DirectionType.Right);
    } catch (e) {
      this.logger.verbose(e.message);
      throw new WsException({
        name: 'ERR_PLAYER_DIR',
        message: 'PLayer cannot move as you like',
        status: 400,
      });
    }
  }

  @SubscribeMessage('player:accelerate')
  async changeSpeed(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const player = await this.playerService.get(data.playerId);
      data.accelerate ? player.increaseSpeed() : player.decreaseSpeed();
    } catch (e) {
      throw new WsException({
        name: 'ERR_PLAYER_DIR',
        message: 'PLayer cannot move as you like',
        status: 400,
      });
    }
  }

  @SubscribeMessage('give:error')
  giveMeSomeError(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    throw new WsException({
      name: 'ERR_SOME',
      message: 'You are a dumb ass',
      status: 400,
    });
  }
}
