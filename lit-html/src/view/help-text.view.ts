import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { emoji } from 'node-emoji';

@customElement('help-text')
export class HelpText extends LitElement {
  static styles = css`
    :host {
      text-align: center;
    }

    code {
      font-weight: bold;
      color: red;
    }
  `;

  protected render() {
    return html`
      <div>
        Use arrow keys (${emoji.point_up}${emoji.point_right}${emoji.point_down}${emoji.point_left}) or
        (<code>WASD</code>) to navigate and <code>Space</code> to accelerate. <code>R</code> to restart.
      </div>
    `;
  }
}
