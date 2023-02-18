import { formDOM, modal, modalDOM, nameDOM } from './ui/modal.js';
import { PlayerService } from './ui/player.service.js';
import { UuidStore } from './ui/store/uuid.store.js';
import { Game } from './game/game.js';

const uuidStore = new UuidStore();
const playerService = new PlayerService(uuidStore);
const game = new Game(640, 480);

(async () => {
  const uuid = uuidStore.getValue();
  if (!uuidStore.hasValue() || !(await playerService.isValidUuid(uuid!))) {
    formDOM.onsubmit = async (submit) => {
      submit.preventDefault();
      playerService
        .fetchUuid(nameDOM.value)
        .then((uuid) => uuidStore.setValue(uuid))
        .then((uuid) => {
          modal.hide();
          game.start(uuid);
        })
        .catch(console.error);
    };
    modalDOM.addEventListener('shown.bs.modal', () => nameDOM.focus());
    return modal.show();
  }

  game.start(uuid!);

  window.onkeydown = (e) => {
    // Disable Space scrolling
    if (e.target === document.body) e.preventDefault();

    const player = game.getPlayer();
    if (!player) return;

    if (['ArrowLeft', 'KeyA'].includes(e.code)) player.goLeft();
    if (['ArrowRight', 'KeyD'].includes(e.code)) player.goRight();
    if (['ArrowDown', 'KeyS'].includes(e.code)) player.goDown();
    if (['ArrowUp', 'KeyW'].includes(e.code)) player.goUp();
    if (['Space'].includes(e.code)) player.increaseSpeed();
  };
  window.onkeyup = (e) => {
    const player = game.getPlayer();

    if (!player) return;
    if (['Space'].includes(e.code)) player.decreaseSpeed();
  };
})().catch(console.error);
