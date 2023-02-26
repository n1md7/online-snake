import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('game-room')
export class GameRoom extends LitElement {
  @property({ type: Number })
  rows = 25;

  @property({ type: Number })
  cols = 40;

  @property({ type: Number })
  blockSize = 10;

  protected render() {
    return html`
      <div class="container-fluid">
        <slot name="player"></slot>
        <canvas-view rows=${this.rows} cols=${this.cols} blockSize=${this.blockSize}></canvas-view>
        <slot name="other-players"></slot>
      </div>
    `;
  }
}
