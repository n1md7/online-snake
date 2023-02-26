import Player from '/src/player/player';

export default class GameService {
  private readonly _ended: boolean;

  constructor(private readonly _player: Player, private readonly _rivals: Player[] = []) {
    this._ended = false;
  }

  get ended() {
    return this._ended;
  }

  addRival(rival: Player) {
    this._rivals.push(rival);
  }

  addRivals(rivals: Player[]) {
    rivals.forEach((rival) => this.addRival(rival));
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Disable default page scrolling on Space key press
    if (e.target === document.body) e.preventDefault();

    if (['ArrowLeft', 'KeyA'].includes(e.code)) this._player.direction.emit('go:left');
    if (['ArrowUp', 'KeyW'].includes(e.code)) this._player.direction.emit('go:up');
    if (['ArrowRight', 'KeyD'].includes(e.code)) this._player.direction.emit('go:right');
    if (['ArrowDown', 'KeyS'].includes(e.code)) this._player.direction.emit('go:down');
    if (['Space'].includes(e.code)) this._player.increaseSpeed();
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (['Space'].includes(e.code)) this._player.decreaseSpeed();
  }

  subscribe() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  unsubscribe() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
