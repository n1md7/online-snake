import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('player-status')
export class PlayerStatus extends LitElement {
  static styles = css`
    :host {
      width: 1000px;
      margin: 8px auto;
      display: flex;
      justify-content: space-evenly;
      position: sticky;
      top: 0;
    }
  `;

  @property({
    type: Number,
    converter: (speed) => Number(speed).toFixed(2),
  })
  speed = 0;

  @property({ type: Number })
  points = 0;

  @property({ type: Number })
  length = 0;

  @property({ type: String })
  name = 'Default';

  @property({ type: String })
  status = 'Active';

  @state()
  private activeColor = {
    color: 'green',
  };

  protected willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('status')) {
      this.activeColor.color = this.status === 'Active' ? `green` : `red`;
    }
  }

  protected render() {
    return html`
      <div><strong>${this.name}</strong></div>
      <div>
        Speed: <strong>${this.speed}</strong>
        <span class="text-muted" title="~Blocks Per Second">BPS</span>
      </div>
      <div>
        Points: <strong>${this.points}</strong>
        <span class="text-muted" title="Points">PTS</span>
      </div>
      <div>
        Length: <strong>${this.length}</strong>
        <span class="text-muted" title="Snake Length in Blocks">B</span>
      </div>
      <div style=${styleMap(this.activeColor)}><strong>${this.status}</strong></div>
    `;
  }
}
