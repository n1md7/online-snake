import { html, render } from 'lit';

render(
  html`
    <div
      id="spinner"
      class="d-flex justify-content-center w-100 h-100 position-fixed top-0 align-items-center bg-dark flex-column hidden"
    >
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">Please wait...</div>
    </div>
  `,
  document.body,
);

class Spinner {
  constructor(private readonly _ref: HTMLDivElement) {}

  show() {
    this._ref.classList.remove('hidden');
  }

  hide() {
    this._ref.classList.add('hidden');
  }
}

export const spinner = new Spinner(document.querySelector('#spinner') as HTMLDivElement);
