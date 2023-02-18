import { Modal } from 'bootstrap';

export const modalDOM = document.querySelector('#player-name-modal')!;
export const formDOM = modalDOM.querySelector('form')!;
export const nameDOM = formDOM.querySelector('input')!;

export const modal = new Modal('#player-name-modal', {
  keyboard: false,
  backdrop: false,
});
