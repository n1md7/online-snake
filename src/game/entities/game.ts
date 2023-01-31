import { Player } from './users/player';
import { Spectator } from './users/spectator';
import { plainToInstance, Type } from 'class-transformer';
import { Grid } from './grid/grid';
import { Food } from './grid/food';
import * as ms from 'ms';

export enum GameMode {
  Classic = 'Classic',
}

export class Game {
  @Type(() => String) private _name: string;
  @Type(() => String) private _createdBy: string = '';
  @Type(() => String) private _mode = GameMode.Classic;
  @Type(() => Boolean) private _isFinished: boolean = false;
  @Type(() => Number) private _createdAt: number = Date.now();
  @Type(() => Number) private _updatedAt: number = Date.now();
  @Type(() => Number) private _finishedAt: number = 0;
  @Type(() => Number) private _lastEmit = Date.now();
  @Type(() => Spectator) private _spectators: Spectator[] = [];

  @Type(() => String) private _id: string;
  get id() {
    return this._id;
  }

  @Type(() => Boolean) private _isStarted: boolean = false;
  get isStarted() {
    return this._isStarted;
  }
  set isStarted(started: boolean) {
    this._isStarted = started;
  }

  @Type(() => Food) private _food = new Food();
  get food() {
    return this._food;
  }

  @Type(() => Grid) private _grid = new Grid();
  get grid() {
    return this._grid;
  }

  @Type(() => Player) private _players: Player[] = [];
  get players() {
    return this._players;
  }

  static from(payload: Partial<Game> | unknown) {
    return plainToInstance(Game, payload);
  }

  addPlayer(player: Player) {
    this._players.push(player);
    for (const [i, idx] of player.blockIndices().entries()) {
      const { row, col } = Grid.get2dIdx(idx);
      this._grid.blocks[row][col]?.updateAsBody();
      if (i === player.blockIndices().size - 1) {
        this._grid.blocks[row][col]?.setIsHead(true);
      }
    }
  }

  needsEmit(currentEmit: number) {
    if (currentEmit - this._lastEmit >= ms('1 second')) {
      this._lastEmit = currentEmit;
      return true;
    }

    return false;
  }
}
