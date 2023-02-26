import { html, render } from 'lit';
import { Modal as BsModal } from 'bootstrap';
import EventEmitter from 'eventemitter2';
import { delay } from '../utils/delay.util';

render(
  html`
    <div
      class="modal fade"
      id="player-name-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="player-name-modal"
      aria-hidden="false"
    >
      <div class="modal-dialog modal-dialog-centered show">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Enter you name</h1>
          </div>
          <form novalidate>
            <div class="modal-body">
              <div class="mb-3 has-validation">
                <input
                  type="text"
                  autofocus
                  class="form-control"
                  name="player-name"
                  placeholder="Your name"
                  autocomplete="off"
                  minlength="2"
                  maxlength="10"
                />
                <div class="invalid-feedback">
                  Invalid name. Only alphanumeric symbols min:2 max:10 are allowed.
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-outline-light">Start game</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  document.body,
);

class Modal extends EventEmitter {
  private readonly _bsModal: BsModal;
  constructor(
    private readonly _modal: HTMLDivElement,
    private readonly _form: HTMLFormElement,
    private readonly _input: HTMLInputElement,
  ) {
    super();
    this._bsModal = new BsModal(_modal, {
      keyboard: false,
      backdrop: false,
    });
    this._handleSubmit();
  }

  private _handleSubmit() {
    this._form.onsubmit = (e) => {
      e.preventDefault();

      const name = this._input.value;
      if (!/^[a-zA-Z0-9]{2,10}$/.test(name)) return this._showError();

      this._showSuccess();

      return delay(0).finally(() => this.emit('submit', name));
    };
  }

  private _showError() {
    this._input.classList.add('is-invalid');
  }

  private _showSuccess() {
    this._input.classList.remove('is-invalid');
    this._input.classList.add('is-valid');
  }

  show() {
    this._bsModal.show();
    this._modal.addEventListener('shown.bs.modal', () => {
      this._input.focus();
    });
  }

  hide() {
    this._bsModal.hide();
  }
}

export const modal = new Modal(
  document.querySelector('#player-name-modal') as HTMLDivElement,
  document.querySelector('#player-name-modal form') as HTMLFormElement,
  document.querySelector('#player-name-modal input') as HTMLInputElement,
);
