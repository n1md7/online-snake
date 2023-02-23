import { MyElement } from '/src/my-element';
import { GameRoom } from '/src/view/game-room.view';
import { PlayerStatus } from '/src/components/player-status.component';
import { GameHeader } from '/src/view/game-header.view';
import { HelpText } from '/src/view/help-text.view';

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
    'game-room': GameRoom;
    'player-status': PlayerStatus;
    'game-header': GameHeader;
    'help-text': HelpText;
  }
}

export {};
