import { GameRoom } from '/src/view/game-room.view';
import { PlayerStatus } from '/src/components/player-status.component';
import { GameHeader } from '/src/view/game-header.view';
import { HelpText } from '/src/view/help-text.view';
import { CanvasView } from '/src/view/canvas.view';

declare global {
  interface HTMLElementTagNameMap {
    'game-room': GameRoom;
    'player-status': PlayerStatus;
    'game-header': GameHeader;
    'help-text': HelpText;
    'canvas-view': CanvasView;
  }
}

export {};
