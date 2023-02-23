import { customElement } from 'lit/decorators.js';
import LitLogo from '../assets/images/lit.svg';
import ViteLogo from '../assets/images/vite.svg';
import SnakeLogo from '../assets/images/snake.png';
import { css, html, LitElement } from 'lit';

@customElement('game-header')
export class GameHeader extends LitElement {
  static styles = css`
    h3 {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 48px;
      height: auto;
    }

    strong {
      margin: 0 8px;
    }

    :slot {
      text-alight: center;
    }
  `;

  protected render() {
    return html`
      <h3 class="text-muted my-3">
        <img src="${ViteLogo}" alt="Vite logo" />
        <strong>+</strong>
        <img src="${LitLogo}" alt="Lit logo" />
        <strong>+</strong>
        <img src="${SnakeLogo}" alt="Snake logo" />
      </h3>
      <slot></slot>
    `;
  }
}
