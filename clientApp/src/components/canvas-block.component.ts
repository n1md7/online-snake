import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('canvas-block')
export class CanvasBlock extends LitElement {
  static styles = css`
    div.block {
      border: 1px solid rgba(0, 0, 0, 0.21);
      font-size: 8px;
      box-sizing: border-box;
      text-align: center;
      color: rgba(0, 0, 0, 0.18);
      vertical-align: middle;
    }
  `;

  @property({ type: Number })
  size = 20;

  @property({ type: String })
  text = '';

  @property({ type: String })
  color = '#111';

  protected render() {
    const style = {
      width: this.size + 'px',
      height: this.size + 'px',
      background: this.color,
    };

    return html`<div style=${styleMap(style)} class="block">${this.text}</div>`;
  }
}
