import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('game-room')
export class GameRoom extends LitElement {
  protected render() {
    return html`
      <div class="container-fluid">
        <slot></slot>
      </div>
    `;
  }
}
