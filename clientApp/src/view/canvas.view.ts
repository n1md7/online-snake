import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { GameController } from '/src/controllers/game.controller';
import { PlayerStatus } from '/src';

@customElement('canvas-view')
export class CanvasView extends LitElement {
  static styles = css`
    :host {
      margin: auto;
    }

    div.board {
      border: 1px solid rgba(0, 0, 0, 0.21);
      box-sizing: content-box;
      margin: 24px auto;
      display: flex;
      flex-wrap: wrap;
      position: sticky;
      top: 24px;
    }
  `;
  @property({ type: Number })
  rows = 25;
  @property({ type: Number })
  cols = 40;
  @property({ type: Number })
  blockSize = 20;

  players: NodeListOf<PlayerStatus>;

  private controller = new GameController(this);

  constructor() {
    super();

    this.players = document.querySelectorAll('player-status');
  }

  protected render() {
    const style = {
      width: this.cols * this.blockSize + 'px',
      height: this.rows * this.blockSize + 'px',
    };

    return html`
      <div class="board" style=${styleMap(style)}>
        ${repeat(this.controller.getGrid(), ({ color }) => {
          return html` <canvas-block color="${color}" size="${this.blockSize}"></canvas-block> `;
        })}
      </div>
    `;
  }
}
